-- =====================================================================
-- Migration 001 — Exclusão lógica (soft delete) das inscrições
--
-- Rode UMA vez no banco que já existe:
--   Supabase → SQL Editor → New query → cole tudo → Run.
-- É seguro rodar de novo: todos os comandos são idempotentes.
--
-- Nenhum dado é apagado. A exclusão passa a ser apenas uma marcação na
-- linha; o candidato, a foto e o currículo continuam no lugar.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Colunas de auditoria da exclusão
-- ---------------------------------------------------------------------
alter table public.inscricoes
  add column if not exists deleted_at     timestamptz,
  add column if not exists deleted_reason text,
  add column if not exists deleted_by     text;

comment on column public.inscricoes.deleted_at is
  'Quando a inscrição foi excluída logicamente. NULL = inscrição ativa.';
comment on column public.inscricoes.deleted_reason is
  'Motivo informado pelo administrador no momento da exclusão. Obrigatório na API.';
comment on column public.inscricoes.deleted_by is
  'Identificação de quem excluiu. O painel usa uma senha única, então o valor '
  'vem de ADMIN_NOME (.env) ou "admin" quando não houver identificação melhor.';

-- ---------------------------------------------------------------------
-- 2) Índice da listagem padrão
--
-- A lista do painel mostra só as ativas e ordena por data. O índice
-- parcial cobre exatamente essa consulta.
-- ---------------------------------------------------------------------
create index if not exists inscricoes_ativas_idx
  on public.inscricoes (created_at desc)
  where deleted_at is null;

-- ---------------------------------------------------------------------
-- 3) E-mail único passa a valer só entre inscrições ATIVAS
--
-- ATENÇÃO — esta é a única mudança de comportamento da migration.
--
-- Antes: o e-mail era único na tabela inteira. Com exclusão lógica isso
-- significaria que um candidato excluído por engano ficaria impedido de
-- se inscrever de novo para sempre, já que a linha antiga continua no
-- banco.
--
-- Agora: não podem existir duas inscrições ATIVAS com o mesmo e-mail —
-- que é a regra que interessa. Se a inscrição anterior foi excluída, a
-- pessoa pode se inscrever novamente, e o histórico da exclusão continua
-- guardado.
--
-- Se você preferir manter o bloqueio permanente, NÃO rode este bloco e
-- deixe o índice antigo como está.
-- ---------------------------------------------------------------------
drop index if exists public.inscricoes_email_unico_idx;

create unique index if not exists inscricoes_email_unico_ativas_idx
  on public.inscricoes (lower(email))
  where deleted_at is null;

-- =====================================================================
-- Conferência
-- =====================================================================
-- select column_name, data_type, is_nullable
-- from information_schema.columns
-- where table_name = 'inscricoes' and column_name like 'deleted%';
--
-- select indexname, indexdef from pg_indexes
-- where tablename = 'inscricoes';
--
-- select count(*) filter (where deleted_at is null)     as ativas,
--        count(*) filter (where deleted_at is not null) as excluidas
-- from public.inscricoes;
