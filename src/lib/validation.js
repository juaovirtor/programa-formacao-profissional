/** Regras de validação e formatação do formulário de inscrição. */

export const PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/**
 * Limite da foto DEPOIS da otimização no navegador (ver src/lib/imagem.js).
 * A foto que o candidato escolhe pode ser bem maior: ela é redimensionada e
 * recomprimida antes de chegar aqui, e quase sempre fica abaixo de 1 MB.
 */
export const PHOTO_MAX_MB = 4;

/**
 * Teto do arquivo ORIGINAL, só para não tentar decodificar algo absurdo e
 * travar o celular. Uma foto de 48 MP em RAW passa disto; de galeria, não.
 */
export const PHOTO_INPUT_MAX_MB = 30;

export const CV_MAX_MB = 10;

/** Máscara de telefone brasileiro: (42) 99978-7068 */
export function maskPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.replace(/^(\d{0,2})/, "($1");
  if (digits.length <= 6) return digits.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
  if (digits.length <= 10) return digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

export function validateNome(value) {
  const nome = value.trim();
  if (!nome) return "Digite seu nome completo.";
  if (nome.length < 5 || !nome.includes(" ")) return "Digite seu nome e sobrenome.";
  return "";
}

export function validateTelefone(value) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Informe seu telefone com DDD.";
  if (digits.length < 10) return "Confira seu telefone. Ex.: (42) 99999-9999";
  return "";
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return "Informe seu melhor e-mail.";
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return "Confira seu e-mail.";
  return "";
}

/**
 * Valida a foto que vai ser ENVIADA — ou seja, a versão já otimizada.
 * A checagem de tamanho acontece depois da compressão, de propósito: é o
 * arquivo final que precisa caber no limite, não o que saiu da câmera.
 */
export function validateFoto(file) {
  if (!file) return "Envie uma foto para continuar.";
  if (!PHOTO_TYPES.includes(file.type)) return "A foto precisa ser JPG, PNG ou WEBP.";
  if (file.size > PHOTO_MAX_MB * 1024 * 1024) {
    return (
      `Mesmo depois de otimizada, a foto ficou com ${formatFileSize(file.size)} — ` +
      `o limite é ${PHOTO_MAX_MB}MB. Tente enviar outra foto.`
    );
  }
  return "";
}

/** Barreira aplicada ao arquivo original, antes de tentar processá-lo. */
export function validateFotoOriginal(file) {
  if (!file) return "Envie uma foto para continuar.";
  if (file.size > PHOTO_INPUT_MAX_MB * 1024 * 1024) {
    return `Esta foto tem ${formatFileSize(file.size)}. Escolha uma foto de até ${PHOTO_INPUT_MAX_MB}MB.`;
  }
  return "";
}

export function validateCurriculo(file) {
  if (!file) return "Envie seu currículo em PDF.";
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "O currículo precisa estar em PDF.";
  if (file.size > CV_MAX_MB * 1024 * 1024) return `O currículo deve ter no máximo ${CV_MAX_MB}MB.`;
  return "";
}

export function validateOrigem(origem, origemOutro) {
  if (!origem) return "Escolha uma opção para continuar.";
  if (origem === "Outro" && !origemOutro.trim()) return "Conte rapidinho como você ficou sabendo.";
  return "";
}

export function validateConsentimento(aceito) {
  if (!aceito) return "Para enviar a inscrição, é preciso autorizar o uso dos seus dados.";
  return "";
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
