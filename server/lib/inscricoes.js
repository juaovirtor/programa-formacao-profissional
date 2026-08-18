import { randomUUID } from "node:crypto";
import {
  BUCKET_CURRICULOS,
  BUCKET_FOTOS,
  TABELA,
  VALIDADE_LINK,
  getSupabase,
} from "./supabase.js";
import { EXTENSOES } from "./validacao.js";

/**
 * Persistência das inscrições no Supabase.
 * - Registro do candidato: tabela `inscricoes` (Postgres)
 * - Foto e currículo: Supabase Storage (buckets privados)
 * O banco guarda apenas o caminho do arquivo, nunca o arquivo em si.
 */

export const STATUS = ["novo", "em_analise", "selecionado", "nao_selecionado"];

/** Código do Postgres para violação de índice único. */
const ERRO_DUPLICADO = "23505";

/**
 * Mensagem mostrada a quem tenta se inscrever com um e-mail já cadastrado.
 * Não confirma nome, data nem qualquer dado do candidato existente.
 */
export const MENSAGEM_EMAIL_DUPLICADO =
  "Este e-mail já possui uma inscrição. Se você acredita que isso seja um engano, " +
  "entre em contato com a equipe responsável pelo programa.";

/**
 * Já existe inscrição com este e-mail?
 * O e-mail chega normalizado em minúsculas pela validação, e o índice único do
 * banco é sobre lower(email) — as duas pontas tratam o caso da mesma forma.
 */
async function emailJaInscrito(email) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABELA)
    .select("id")
    .eq("email", email)
    // Só inscrições ativas bloqueiam. Uma inscrição excluída não impede que
    // a pessoa se inscreva de novo — é a mesma regra do índice único parcial.
    .is("deleted_at", null)
    .limit(1);

  if (error) {
    // Não dá para afirmar que está livre: deixa o índice único decidir no insert.
    console.error("[inscricoes] falha ao checar e-mail existente:", error);
    return false;
  }
  return (data ?? []).length > 0;
}

const COLUNAS =
  "id, protocolo, nome_completo, telefone, email, foto_path, curriculo_path, " +
  "origem, origem_outro, consentimento_aceito, consentimento_em, consentimento_texto, " +
  "status, observacoes, created_at, updated_at, " +
  "deleted_at, deleted_reason, deleted_by";

/* ------------------------------------------------------------------ */
/* Criação                                                             */
/* ------------------------------------------------------------------ */

/**
 * Grava a inscrição inteira: sobe os dois arquivos e cria o registro.
 * Só devolve sucesso se as três etapas concluírem. Se qualquer uma falhar,
 * os arquivos já enviados são apagados para não deixar lixo no Storage.
 *
 * @returns {Promise<{ok: true, protocolo: string, id: string}
 *                 | {ok: false, erro: string, conflito?: boolean}>}
 */
export async function criarInscricao({ dados, foto, curriculo }) {
  const supabase = getSupabase();

  // Duplicidade é conferida ANTES de qualquer upload: numa segunda tentativa
  // com o mesmo e-mail, nada chega a ser gravado no Storage.
  if (await emailJaInscrito(dados.email)) {
    return { ok: false, conflito: true, erro: MENSAGEM_EMAIL_DUPLICADO };
  }

  // O id é gerado aqui para servir também de pasta dos arquivos no Storage.
  const id = randomUUID();
  const fotoPath = `${id}/foto.${EXTENSOES[foto.mimetype]}`;
  const curriculoPath = `${id}/curriculo.pdf`;

  const enviados = [];

  const limpar = async () => {
    for (const { bucket, path } of enviados) {
      try {
        await supabase.storage.from(bucket).remove([path]);
      } catch (err) {
        console.error("[inscricoes] não consegui remover arquivo órfão:", bucket, path, err);
      }
    }
  };

  // 1) Foto
  const envioFoto = await supabase.storage
    .from(BUCKET_FOTOS)
    .upload(fotoPath, foto.buffer, { contentType: foto.mimetype, upsert: false });

  if (envioFoto.error) {
    console.error("[inscricoes] falha no upload da foto:", envioFoto.error);
    return { ok: false, erro: "Não conseguimos salvar sua foto. Tente novamente." };
  }
  enviados.push({ bucket: BUCKET_FOTOS, path: fotoPath });

  // 2) Currículo
  const envioCurriculo = await supabase.storage
    .from(BUCKET_CURRICULOS)
    .upload(curriculoPath, curriculo.buffer, { contentType: curriculo.mimetype, upsert: false });

  if (envioCurriculo.error) {
    console.error("[inscricoes] falha no upload do currículo:", envioCurriculo.error);
    await limpar();
    return { ok: false, erro: "Não conseguimos salvar seu currículo. Tente novamente." };
  }
  enviados.push({ bucket: BUCKET_CURRICULOS, path: curriculoPath });

  // 3) Registro no banco
  const { data, error } = await supabase
    .from(TABELA)
    .insert({ id, ...dados, foto_path: fotoPath, curriculo_path: curriculoPath })
    // Os campos extras alimentam o e-mail de aviso enviado logo depois.
    .select("id, protocolo, nome_completo, email, telefone, created_at")
    .single();

  if (error) {
    await limpar(); // evita arquivos órfãos sem candidato correspondente

    // Rede de segurança do banco: se dois envios com o mesmo e-mail chegarem
    // ao mesmo tempo, a checagem inicial deixa os dois passarem e é o índice
    // único que barra o segundo. Os arquivos dele já foram removidos acima.
    if (error.code === ERRO_DUPLICADO) {
      return { ok: false, conflito: true, erro: MENSAGEM_EMAIL_DUPLICADO };
    }

    console.error("[inscricoes] falha ao gravar o registro:", error);
    return { ok: false, erro: "Não conseguimos concluir sua inscrição. Tente novamente." };
  }

  return {
    ok: true,
    id: data.id,
    protocolo: data.protocolo,
    inscricao: {
      id: data.id,
      protocolo: data.protocolo,
      nome: data.nome_completo,
      email: data.email,
      telefone: data.telefone,
      criadoEm: data.created_at,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Leitura                                                             */
/* ------------------------------------------------------------------ */

/**
 * Lista as inscrições.
 *
 * Por padrão devolve só as ATIVAS. As excluídas continuam no banco e só
 * aparecem quando pedidas explicitamente — nunca se misturam com a lista
 * normal do painel.
 *
 * @param {{excluidas?: boolean}} opcoes  excluidas: true → só as excluídas
 */
export async function listarInscricoes({ excluidas = false } = {}) {
  const supabase = getSupabase();

  let consulta = supabase.from(TABELA).select(COLUNAS);
  consulta = excluidas
    ? consulta.not("deleted_at", "is", null).order("deleted_at", { ascending: false })
    : consulta.is("deleted_at", null).order("created_at", { ascending: false });

  const { data, error } = await consulta;
  if (error) throw error;

  const links = await gerarLinks(data ?? []);
  return (data ?? []).map((row) => paraPublico(row, links));
}

export async function obterInscricao(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from(TABELA).select(COLUNAS).eq("id", id).maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const links = await gerarLinks([data]);
  return paraPublico(data, links);
}

/**
 * Muda status/observações. Só age sobre inscrições ativas: um registro
 * excluído é histórico e não deve mais ser editado.
 */
export async function atualizarInscricao(id, patch) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABELA)
    .update(patch)
    .eq("id", id)
    .is("deleted_at", null)
    .select(COLUNAS)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const links = await gerarLinks([data]);
  return paraPublico(data, links);
}

/* ------------------------------------------------------------------ */
/* Exclusão lógica                                                     */
/* ------------------------------------------------------------------ */

/** Tamanho máximo guardado do motivo da exclusão. */
export const MOTIVO_MAX = 500;

/**
 * Marca a inscrição como excluída. NADA é apagado:
 * a linha continua no banco e a foto e o currículo continuam no Storage.
 * A exclusão é só o preenchimento dos três campos de auditoria.
 *
 * @param {string} id
 * @param {{motivo: string, por: string}} dados
 * @returns {Promise<object|null>}  null quando não existe ou já estava excluída
 */
export async function excluirInscricao(id, { motivo, por }) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from(TABELA)
    .update({
      deleted_at: new Date().toISOString(),
      deleted_reason: String(motivo).trim().slice(0, MOTIVO_MAX),
      deleted_by: por,
    })
    .eq("id", id)
    // Evita sobrescrever a auditoria de uma exclusão anterior.
    .is("deleted_at", null)
    .select(COLUNAS)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const links = await gerarLinks([data]);
  return paraPublico(data, links);
}

/* ------------------------------------------------------------------ */
/* Links assinados                                                     */
/* ------------------------------------------------------------------ */

/**
 * Os buckets são privados. Para o painel exibir a foto e abrir o currículo,
 * geramos links temporários assinados (validade de 1 hora).
 */
async function gerarLinks(linhas) {
  if (linhas.length === 0) return {};

  const supabase = getSupabase();
  const mapa = {};

  const assinar = async (bucket, caminhos) => {
    if (caminhos.length === 0) return;
    const { data, error } = await supabase.storage.from(bucket).createSignedUrls(caminhos, VALIDADE_LINK);
    if (error) {
      console.error("[inscricoes] não consegui assinar links:", bucket, error);
      return;
    }
    for (const item of data ?? []) {
      if (item.signedUrl) mapa[item.path] = item.signedUrl;
    }
  };

  await Promise.all([
    assinar(BUCKET_FOTOS, linhas.map((l) => l.foto_path).filter(Boolean)),
    assinar(BUCKET_CURRICULOS, linhas.map((l) => l.curriculo_path).filter(Boolean)),
  ]);

  return mapa;
}

/** Formato consumido pelo painel. */
function paraPublico(row, links) {
  return {
    id: row.id,
    protocolo: row.protocolo,
    nome: row.nome_completo,
    telefone: row.telefone,
    email: row.email,
    origem: row.origem,
    origemOutro: row.origem_outro ?? "",
    status: row.status,
    observacoes: row.observacoes ?? "",
    criadoEm: row.created_at,
    atualizadoEm: row.updated_at,
    consentimento: {
      aceito: Boolean(row.consentimento_aceito),
      em: row.consentimento_em,
      texto: row.consentimento_texto ?? "",
    },
    // Os arquivos continuam acessíveis mesmo depois da exclusão lógica —
    // é justamente disso que o histórico depende.
    fotoUrl: links[row.foto_path] ?? null,
    curriculoUrl: links[row.curriculo_path] ?? null,
    curriculoNome: `curriculo-${row.protocolo}.pdf`,
    excluida: Boolean(row.deleted_at),
    exclusao: row.deleted_at
      ? {
          em: row.deleted_at,
          motivo: row.deleted_reason ?? "",
          por: row.deleted_by ?? "",
        }
      : null,
  };
}
