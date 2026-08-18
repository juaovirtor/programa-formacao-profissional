/** Cliente da API do painel administrativo. */

const API_URL = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "vs_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Resolve a URL de um arquivo do candidato.
 *
 * A API devolve links assinados do Supabase Storage (URLs absolutas, com
 * validade de 1 hora) — esses são usados como estão. O formato relativo
 * continua sendo aceito, com o token anexado, caso a API mude no futuro.
 */
export function withToken(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_URL}${url}?token=${encodeURIComponent(getToken() ?? "")}`;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${getToken() ?? ""}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    clearToken();
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? `Erro ${response.status}`);
  return data;
}

export async function login(senha) {
  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senha }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Não foi possível entrar.");
  setToken(data.token);
  return data.token;
}

/** Por padrão traz só as ativas; `excluidas: true` traz só as excluídas. */
export const listarInscricoes = ({ excluidas = false } = {}) =>
  request(`/api/admin/inscricoes${excluidas ? "?excluidas=1" : ""}`);

export const atualizarInscricao = (id, patch) =>
  request(`/api/admin/inscricoes/${id}`, { method: "PATCH", body: JSON.stringify(patch) });

/**
 * Exclusão lógica: marca a inscrição como excluída, sem apagar nada.
 * O motivo é obrigatório e a API recusa a chamada sem ele.
 */
export const excluirInscricao = (id, motivo) =>
  request(`/api/admin/inscricoes/${id}`, { method: "DELETE", body: JSON.stringify({ motivo }) });
