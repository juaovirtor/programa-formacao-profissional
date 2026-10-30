-- =====================================================================
-- Migration 002 — Novo status "formado"
--
-- Rode UMA vez no banco que já existe:
--   Supabase → SQL Editor → New query → cole tudo → Run.
-- É seguro rodar de novo: o comando é idempotente.
--
-- Nenhum dado é alterado. Só a regra que limita os valores aceitos na
-- coluna `status` passa a incluir 'formado' — o candidato que concluiu o
-- programa depois de ter sido selecionado.
--
-- Rode ANTES de publicar a nova versão da API: sem esta migration, marcar
-- alguém como "Formado" no painel dá erro.
-- =====================================================================

-- A regra foi criada sem nome no schema.sql, então o Postgres a chamou de
-- inscricoes_status_check. Recriamos com o mesmo nome e a lista nova.
alter table public.inscricoes
  drop constraint if exists inscricoes_status_check;

alter table public.inscricoes
  add constraint inscricoes_status_check
  check (status in ('novo', 'em_analise', 'selecionado', 'formado', 'nao_selecionado'));

-- =====================================================================
-- Conferência
-- =====================================================================
-- select pg_get_constraintdef(oid) from pg_constraint
-- where conrelid = 'public.inscricoes'::regclass and conname = 'inscricoes_status_check';
