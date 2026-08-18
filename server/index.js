import "dotenv/config";
import cors from "cors";
import express from "express";
import multer from "multer";

import { checkPassword, createToken, identificacaoAdmin, requireAdmin } from "./lib/auth.js";
import { supabaseConfigurado } from "./lib/supabase.js";
import {
  MOTIVO_MAX,
  STATUS,
  atualizarInscricao,
  criarInscricao,
  excluirInscricao,
  listarInscricoes,
  obterInscricao,
} from "./lib/inscricoes.js";
import { notificarNovaInscricao, pendenciasDaNotificacao } from "./lib/notificacao.js";
import { CURRICULO_MAX, FOTO_MAX, validarInscricao } from "./lib/validacao.js";

const PORT = Number(process.env.PORT ?? 3001);

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(express.json());

/* ------------------------------------------------------------------ */
/* Upload                                                              */
/*                                                                     */
/* Os arquivos ficam em memória e vão direto para o Supabase Storage —  */
/* nada é gravado no disco do servidor.                                 */
/* ------------------------------------------------------------------ */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Math.max(FOTO_MAX, CURRICULO_MAX), files: 2 },
});

const camposArquivo = upload.fields([
  { name: "foto", maxCount: 1 },
  { name: "curriculo", maxCount: 1 },
]);

/* ------------------------------------------------------------------ */
/* Saúde                                                               */
/* ------------------------------------------------------------------ */

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, supabase: supabaseConfigurado() });
});

/* ------------------------------------------------------------------ */
/* Público — recebe as inscrições do site                              */
/* ------------------------------------------------------------------ */

app.post("/api/inscricoes", camposArquivo, async (req, res) => {
  if (!supabaseConfigurado()) {
    console.error("[api] Supabase não configurado — inscrição recusada.");
    return res.status(503).json({
      error: "O sistema de inscrições está indisponível no momento. Tente novamente mais tarde.",
    });
  }

  const validacao = validarInscricao(req.body, req.files);
  if (!validacao.ok) {
    return res.status(400).json({ error: validacao.erro });
  }

  const resultado = await criarInscricao(validacao);
  if (!resultado.ok) {
    // 409 quando o e-mail já tem inscrição; 502 quando o Supabase falhou.
    return res.status(resultado.conflito ? 409 : 502).json({ error: resultado.erro });
  }

  // Sucesso só chega aqui: arquivos no Storage e registro no banco, os dois.
  res.status(201).json({ ok: true, protocolo: resultado.protocolo });

  // Aviso à equipe — depois da resposta, de propósito. Sem await e sem
  // possibilidade de lançar: se o e-mail falhar, a inscrição continua válida
  // e o erro fica registrado no log da API.
  notificarNovaInscricao(resultado.inscricao);
});

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

app.post("/api/admin/login", (req, res) => {
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: "ADMIN_PASSWORD não configurada no servidor." });
  }
  if (!checkPassword(req.body?.senha)) {
    return res.status(401).json({ error: "Senha incorreta." });
  }
  res.json({ token: createToken() });
});

/**
 * Lista as inscrições ATIVAS.
 * `?excluidas=1` troca a lista pelas excluídas — nunca vêm as duas juntas.
 */
app.get("/api/admin/inscricoes", requireAdmin, async (req, res, next) => {
  const excluidas = req.query.excluidas === "1" || req.query.excluidas === "true";
  try {
    const inscricoes = await listarInscricoes({ excluidas });
    res.json({
      excluidas,
      inscricoes,
      resumo: {
        total: inscricoes.length,
        novos: inscricoes.filter((i) => i.status === "novo").length,
        emAnalise: inscricoes.filter((i) => i.status === "em_analise").length,
        selecionados: inscricoes.filter((i) => i.status === "selecionado").length,
      },
    });
  } catch (err) {
    next(err);
  }
});

app.get("/api/admin/inscricoes/:id", requireAdmin, async (req, res, next) => {
  try {
    const inscricao = await obterInscricao(req.params.id);
    if (!inscricao) return res.status(404).json({ error: "Inscrição não encontrada." });
    res.json(inscricao);
  } catch (err) {
    next(err);
  }
});

app.patch("/api/admin/inscricoes/:id", requireAdmin, async (req, res, next) => {
  const patch = {};
  if (req.body?.status !== undefined) {
    if (!STATUS.includes(req.body.status)) {
      return res.status(400).json({ error: "Status inválido." });
    }
    patch.status = req.body.status;
  }
  if (req.body?.observacoes !== undefined) {
    patch.observacoes = String(req.body.observacoes).slice(0, 5000);
  }
  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ error: "Nada para atualizar." });
  }

  try {
    const inscricao = await atualizarInscricao(req.params.id, patch);
    if (!inscricao) {
      // Também cai aqui quando a inscrição existe mas está excluída:
      // registro excluído é histórico e não aceita mais edição.
      return res.status(404).json({ error: "Inscrição não encontrada ou já excluída." });
    }
    res.json(inscricao);
  } catch (err) {
    next(err);
  }
});

/**
 * Exclusão LÓGICA. Não existe DELETE físico em lugar nenhum desta API:
 * o registro continua no banco e os arquivos continuam no Storage.
 * O motivo é obrigatório — é ele que sustenta a auditoria.
 */
app.delete("/api/admin/inscricoes/:id", requireAdmin, async (req, res, next) => {
  const motivo = String(req.body?.motivo ?? "").trim();
  if (motivo.length < 3) {
    return res.status(400).json({ error: "Informe o motivo da exclusão." });
  }
  if (motivo.length > MOTIVO_MAX) {
    return res.status(400).json({ error: `O motivo deve ter no máximo ${MOTIVO_MAX} caracteres.` });
  }

  try {
    const inscricao = await excluirInscricao(req.params.id, {
      motivo,
      por: identificacaoAdmin(),
    });
    if (!inscricao) {
      return res.status(404).json({ error: "Inscrição não encontrada ou já excluída." });
    }
    res.json(inscricao);
  } catch (err) {
    next(err);
  }
});

/* ------------------------------------------------------------------ */

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const msg =
      err.code === "LIMIT_FILE_SIZE" ? "Arquivo acima do tamanho permitido." : err.message;
    return res.status(400).json({ error: msg });
  }
  console.error("[api]", err);
  res.status(500).json({ error: "Erro interno. Tente novamente." });
});

app.listen(PORT, () => {
  console.log(`API do Programa de Formação em http://localhost:${PORT}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.warn("⚠  ADMIN_PASSWORD não definida — o painel não vai abrir.");
  }
  if (!supabaseConfigurado()) {
    console.warn(
      "⚠  SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não definidas — as inscrições serão recusadas.",
    );
  }
  const pendencias = pendenciasDaNotificacao();
  if (pendencias.length > 0) {
    console.warn(
      `⚠  Aviso por e-mail desligado — falta configurar: ${pendencias.join(", ")}. ` +
        "As inscrições continuam funcionando normalmente.",
    );
  } else {
    console.log(`✓ Aviso de nova inscrição por e-mail ativo (${process.env.EMAIL_PROVIDER}).`);
  }
});
