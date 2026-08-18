-- =====================================================================
-- Programa de Formação Profissional — Group Phoenix
-- Estrutura do banco no Supabase.
--
-- Como usar: Supabase → SQL Editor → New query → cole tudo → Run.
-- Pode rodar mais de uma vez sem quebrar nada.
-- =====================================================================

-- gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Numeração do protocolo (VS-2026-0001, VS-2026-0002, ...)
-- ---------------------------------------------------------------------
create sequence if not exists public.inscricoes_protocolo_seq;

-- ---------------------------------------------------------------------
-- Tabela de candidatos
-- ---------------------------------------------------------------------
create table if not exists public.inscricoes (
  id                    uuid primary key default gen_random_uuid(),

  protocolo             text not null unique
                        default (
                          'VS-' ||
                          to_char(timezone('America/Sao_Paulo', now()), 'YYYY') || '-' ||
                          lpad(nextval('public.inscricoes_protocolo_seq')::text, 4, '0')
                        ),

  nome_completo         text not null,
  telefone              text not null,
  email                 text not null,

  -- Caminho do arquivo no Storage. O arquivo em si NUNCA fica no banco.
  foto_path             text not null,
  curriculo_path        text not null,

  origem                text not null,
  origem_outro          text not null default '',

  -- Registro do aceite (LGPD)
  consentimento_aceito  boolean not null default false,
  consentimento_em      timestamptz,
  consentimento_texto   text not null default '',

  -- Acompanhamento pelo painel
  status                text not null default 'novo'
                        check (status in ('novo', 'em_analise', 'selecionado', 'nao_selecionado')),
  observacoes           text not null default '',

  -- Exclusão lógica. Nada é apagado: a inscrição sai da lista ativa mas
  -- o candidato, a foto e o currículo continuam no lugar, com o registro
  -- de quando, por quê e por quem foi excluída.
  deleted_at            timestamptz,
  deleted_reason        text,
  deleted_by            text,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.inscricoes is
  'Inscrições do Programa de Formação Profissional. Acesso apenas pela API (service_role).';

-- ---------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------
create index if not exists inscricoes_created_at_idx on public.inscricoes (created_at desc);
create index if not exists inscricoes_status_idx     on public.inscricoes (status);

-- A listagem padrão do painel mostra só as ativas, ordenadas por data.
create index if not exists inscricoes_ativas_idx
  on public.inscricoes (created_at desc)
  where deleted_at is null;

-- ---------------------------------------------------------------------
-- E-mail único entre as inscrições ATIVAS, ignorando maiúsculas/minúsculas.
--
-- É o índice em lower(email) que garante a regra: joao@email.com e
-- JOAO@EMAIL.COM contam como o mesmo e-mail. A API também confere antes
-- de subir os arquivos, mas quem realmente impede a duplicata é o banco —
-- inclusive se dois envios chegarem ao mesmo tempo.
--
-- O "where deleted_at is null" existe por causa da exclusão lógica: uma
-- inscrição excluída não deve bloquear o e-mail para sempre.
--
-- Se este comando falhar com "could not create unique index", já existem
-- e-mails repetidos na tabela. Rode a consulta abaixo para encontrá-los,
-- resolva os casos e tente de novo:
--
--   select lower(email) as email, count(*), array_agg(protocolo)
--   from public.inscricoes
--   where deleted_at is null
--   group by lower(email) having count(*) > 1;
-- ---------------------------------------------------------------------
drop index if exists public.inscricoes_email_idx;
drop index if exists public.inscricoes_email_unico_idx;
create unique index if not exists inscricoes_email_unico_ativas_idx
  on public.inscricoes (lower(email))
  where deleted_at is null;

-- ---------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inscricoes_set_updated_at on public.inscricoes;
create trigger inscricoes_set_updated_at
  before update on public.inscricoes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Segurança: RLS ligado e SEM políticas.
--
-- Com RLS ligado e nenhuma política criada, as chaves públicas (anon)
-- não leem nem escrevem NADA nesta tabela. A service_role usada pela API
-- ignora o RLS e continua com acesso total.
-- É exatamente o que queremos: o banco só é acessível pelo backend.
-- ---------------------------------------------------------------------
alter table public.inscricoes enable row level security;

-- ---------------------------------------------------------------------
-- Buckets do Storage (privados)
--
-- Dá para criar pela interface (Storage → New bucket), mas aqui já sai
-- com os tipos e limites certos.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'fotos-candidatos',
  'fotos-candidatos',
  false,                                                -- privado
  5242880,                                              -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'curriculos-candidatos',
  'curriculos-candidatos',
  false,                                                -- privado
  10485760,                                             -- 10 MB
  array['application/pdf']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Os buckets são privados e não recebem políticas: só a service_role
-- (a API) escreve e gera os links temporários que o painel usa.

-- =====================================================================
-- Conferência rápida
-- =====================================================================
-- select count(*) from public.inscricoes;
-- select id, name, public, file_size_limit from storage.buckets;

-- Confere se a trava de e-mail único está ativa:
-- select indexname, indexdef from pg_indexes
-- where tablename = 'inscricoes' and indexname = 'inscricoes_email_unico_idx';
