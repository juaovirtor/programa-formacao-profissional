-- =====================================================================
-- Migration 003 — Foto e currículo opcionais
--
-- Rode UMA vez no banco que já existe:
--   Supabase → SQL Editor → New query → cole tudo → Run.
-- É seguro rodar de novo: o comando é idempotente.
--
-- Nenhum dado é alterado. As colunas só deixam de exigir valor: quando o
-- candidato não envia foto ou currículo, o caminho fica NULL.
--
-- Rode ANTES de publicar a nova versão da API: sem esta migration, uma
-- inscrição sem foto ou sem currículo é recusada pelo banco.
-- =====================================================================

alter table public.inscricoes
  alter column foto_path      drop not null,
  alter column curriculo_path drop not null;

-- =====================================================================
-- Conferência (is_nullable deve ser YES nas duas)
-- =====================================================================
-- select column_name, is_nullable from information_schema.columns
-- where table_name = 'inscricoes' and column_name in ('foto_path', 'curriculo_path');
