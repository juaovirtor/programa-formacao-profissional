/**
 * Validação no servidor.
 * O frontend também valida, mas quem decide é aqui — o navegador pode ser
 * contornado, então nenhuma inscrição entra no banco sem passar por estas regras.
 */

export const MB = 1024 * 1024;

export const FOTO_TIPOS = ["image/jpeg", "image/png", "image/webp"];
export const FOTO_MAX = 5 * MB;

export const CURRICULO_TIPOS = ["application/pdf"];
export const CURRICULO_MAX = 10 * MB;

export const ORIGENS = [
  "Instagram",
  "Facebook",
  "WhatsApp",
  "Escola",
  "Indicação de amigo",
  "Site",
  "Outro",
];

/** Extensão usada no Storage, derivada do tipo do arquivo. */
export const EXTENSOES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

/**
 * @returns {{ok: true, dados: object} | {ok: false, erro: string}}
 */
export function validarInscricao(corpo, arquivos) {
  const nome = String(corpo.nome ?? "").trim();
  const telefone = String(corpo.telefone ?? "").replace(/\D/g, "");
  const email = String(corpo.email ?? "").trim().toLowerCase();
  const origem = String(corpo.origem ?? "").trim();
  const origemOutro = String(corpo.origem_outro ?? "").trim();
  const consentimento = String(corpo.consentimento ?? "") === "true";

  const foto = arquivos?.foto?.[0];
  const curriculo = arquivos?.curriculo?.[0];

  if (nome.length < 5 || !nome.includes(" ")) {
    return { ok: false, erro: "Informe o nome completo (nome e sobrenome)." };
  }
  if (telefone.length < 10 || telefone.length > 11) {
    return { ok: false, erro: "Telefone inválido. Use DDD + número." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
    return { ok: false, erro: "E-mail inválido." };
  }
  if (!ORIGENS.includes(origem)) {
    return { ok: false, erro: "Origem inválida." };
  }
  if (origem === "Outro" && !origemOutro) {
    return { ok: false, erro: "Descreva como você conheceu o programa." };
  }
  // LGPD: sem consentimento não há base legal para guardar os dados.
  if (!consentimento) {
    return { ok: false, erro: "É preciso autorizar o uso dos dados para enviar a inscrição." };
  }

  if (!foto) return { ok: false, erro: "Envie uma foto." };
  if (!FOTO_TIPOS.includes(foto.mimetype)) {
    return { ok: false, erro: "A foto precisa ser JPG, PNG ou WEBP." };
  }
  if (foto.size > FOTO_MAX) {
    return { ok: false, erro: "A foto deve ter no máximo 5MB." };
  }

  if (!curriculo) return { ok: false, erro: "Envie o currículo em PDF." };
  if (!CURRICULO_TIPOS.includes(curriculo.mimetype)) {
    return { ok: false, erro: "O currículo precisa estar em PDF." };
  }
  if (curriculo.size > CURRICULO_MAX) {
    return { ok: false, erro: "O currículo deve ter no máximo 10MB." };
  }

  return {
    ok: true,
    dados: {
      nome_completo: nome,
      telefone,
      email,
      origem,
      origem_outro: origem === "Outro" ? origemOutro : "",
      consentimento_aceito: true,
      consentimento_em: new Date().toISOString(),
      consentimento_texto: String(corpo.consentimento_texto ?? "").slice(0, 1000),
    },
    foto,
    curriculo,
  };
}
