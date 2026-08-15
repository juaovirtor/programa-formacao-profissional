import { privacidade } from "../data/program";

/**
 * Envio das inscrições.
 *
 * Endpoint: POST {VITE_API_URL}/api/inscricoes   (multipart/form-data)
 *
 * A API grava no Supabase (banco + Storage) e só responde sucesso depois que
 * tudo foi realmente armazenado. Qualquer falha vira mensagem de erro para o
 * candidato — nunca mostramos "inscrição recebida" sem gravação confirmada.
 *
 * Em desenvolvimento, VITE_API_URL fica vazio e o Vite faz proxy de /api
 * para o servidor local (npm run api).
 */

const API_URL = import.meta.env.VITE_API_URL ?? "";
const ENDPOINT = "/api/inscricoes";

/** Monta o FormData no formato que a API recebe. */
export function buildApplicationPayload(data) {
  const payload = new FormData();
  payload.append("nome", data.nome.trim());
  payload.append("telefone", data.telefone.replace(/\D/g, ""));
  payload.append("email", data.email.trim().toLowerCase());
  payload.append("origem", data.origem);
  payload.append("origem_outro", data.origem === "Outro" ? data.origemOutro.trim() : "");
  payload.append("consentimento", String(Boolean(data.consentimento)));
  payload.append("consentimento_texto", privacidade.aceite);
  if (data.foto) payload.append("foto", data.foto, data.foto.name);
  if (data.curriculo) payload.append("curriculo", data.curriculo, data.curriculo.name);
  return payload;
}

/**
 * @returns {Promise<{ ok: boolean, protocolo?: string, error?: string }>}
 */
export async function submitApplication(data) {
  const payload = buildApplicationPayload(data);

  let response;
  try {
    response = await fetch(`${API_URL}${ENDPOINT}`, { method: "POST", body: payload });
  } catch {
    return {
      ok: false,
      error: "Não foi possível concluir a inscrição. Verifique sua internet e tente novamente.",
    };
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      ok: false,
      error: result.error ?? "Não foi possível concluir a inscrição. Tente novamente.",
    };
  }

  // A API só devolve 2xx depois de gravar o registro e os dois arquivos.
  return { ok: true, protocolo: result.protocolo };
}
