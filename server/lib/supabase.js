import { createClient } from "@supabase/supabase-js";

/**
 * Cliente do Supabase — SOMENTE no backend.
 *
 * Usa a SERVICE ROLE KEY, que ignora as políticas de RLS e tem acesso total.
 * Ela nunca pode ir para o navegador: não existe nenhuma variável VITE_
 * apontando para esta chave, e este arquivo não é importado pelo frontend.
 */

/**
 * O painel do Supabase mostra endereços como ".../rest/v1/" em algumas telas.
 * O cliente espera apenas a URL do projeto — se vier com o caminho junto, ele
 * montaria "/rest/v1//rest/v1/..." e tudo quebraria. Normalizamos aqui.
 */
function normalizarUrl(valor) {
  if (!valor) return valor;
  return valor
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/(rest|storage|auth)\/v1$/, "")
    .replace(/\/+$/, "");
}

const SUPABASE_URL = normalizarUrl(process.env.SUPABASE_URL);
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export const TABELA = process.env.SUPABASE_TABELA ?? "inscricoes";
export const BUCKET_FOTOS = process.env.SUPABASE_BUCKET_FOTOS ?? "fotos-candidatos";
export const BUCKET_CURRICULOS = process.env.SUPABASE_BUCKET_CURRICULOS ?? "curriculos-candidatos";

/** Tempo de validade dos links assinados dos arquivos (segundos). */
export const VALIDADE_LINK = 60 * 60; // 1 hora

export function supabaseConfigurado() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

let cliente = null;

export function getSupabase() {
  if (!supabaseConfigurado()) {
    throw new Error(
      "Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env do servidor.",
    );
  }
  if (!cliente) {
    cliente = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cliente;
}
