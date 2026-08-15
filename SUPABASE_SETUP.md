# Configurar o Supabase — passo a passo

Este guia vai do zero até a primeira inscrição gravada. Não precisa saber banco de dados:
é copiar, colar e conferir.

O Supabase vai guardar duas coisas:

- **o registro do candidato** (nome, telefone, e-mail…) em uma tabela;
- **a foto e o currículo** no Storage (o "HD" do Supabase).

O banco guarda só o *caminho* dos arquivos — nunca os arquivos em si.

---

## 1. Criar o projeto no Supabase

1. Acesse **https://supabase.com** e clique em **Start your project**.
2. Entre com GitHub ou e-mail.
3. Clique em **New project**.
4. Preencha:
   - **Name:** `programa-formacao` (ou o nome que preferir)
   - **Database Password:** clique em *Generate a password* e **guarde num lugar seguro**
     (você não vai precisar dela no dia a dia, mas não dá para recuperar depois)
   - **Region:** `South America (São Paulo)` — mais perto, mais rápido
5. Clique em **Create new project** e espere ~2 minutos.

---

## 2. Onde encontrar a URL do projeto

No menu lateral: **Project Settings** (engrenagem) → **API**.

O primeiro campo é **Project URL**. É algo como:

```
https://abcdefghijklmnop.supabase.co
```

Esse valor vai na variável `SUPABASE_URL`.

---

## 3. Onde encontrar as chaves

Na mesma tela (**Project Settings → API**), em **Project API keys**, existem duas:

| Chave | Para que serve | Pode aparecer no navegador? |
| --- | --- | --- |
| `anon` / `publishable` | acesso público, limitado pelas regras do banco | Sim — **mas este projeto não usa** |
| `service_role` / `secret` | acesso total, ignora todas as regras | **NUNCA** |

Clique em **Reveal** na **service_role** e copie. Esse valor vai em
`SUPABASE_SERVICE_ROLE_KEY`, **somente no servidor da API**.

> ⚠️ A `service_role` é como a senha de administrador do banco. Quem tiver essa chave
> lê, altera e apaga tudo. Ela não pode entrar em nenhuma variável `VITE_`, não pode ir
> para o Netlify e não pode ser versionada no GitHub.

---

## 4. Criar a tabela

1. No menu lateral, abra **SQL Editor**.
2. Clique em **New query**.
3. Abra o arquivo [`supabase/schema.sql`](supabase/schema.sql) deste projeto, copie **todo**
   o conteúdo e cole no editor.
4. Clique em **Run** (ou `Ctrl` + `Enter`).

Deve aparecer **Success. No rows returned**. Pronto.

Esse SQL cria:

- a tabela `inscricoes` com todas as colunas;
- a numeração automática do protocolo (`VS-2026-0001`, `VS-2026-0002`…);
- os índices;
- a **trava de e-mail único** (o mesmo e-mail não se inscreve duas vezes);
- o `updated_at` automático;
- a trava de segurança (RLS);
- **os dois buckets do Storage já com os limites certos**.

> Se o comando falhar com **"could not create unique index"**, é porque já existem
> e-mails repetidos na tabela. Rode isto para encontrá-los, resolva os casos e execute
> o script de novo:
>
> ```sql
> select lower(email) as email, count(*), array_agg(protocolo)
> from public.inscricoes
> group by lower(email) having count(*) > 1;
> ```

Para conferir: menu **Table Editor** → a tabela `inscricoes` deve aparecer na lista.

### O SQL da tabela (o mesmo do arquivo)

```sql
create extension if not exists "pgcrypto";
create sequence if not exists public.inscricoes_protocolo_seq;

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
  foto_path             text not null,
  curriculo_path        text not null,
  origem                text not null,
  origem_outro          text not null default '',
  consentimento_aceito  boolean not null default false,
  consentimento_em      timestamptz,
  consentimento_texto   text not null default '',
  status                text not null default 'novo'
                        check (status in ('novo','em_analise','selecionado','nao_selecionado')),
  observacoes           text not null default '',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- E-mail único, ignorando maiúsculas/minúsculas:
-- joao@email.com e JOAO@EMAIL.COM contam como o mesmo e-mail.
create unique index if not exists inscricoes_email_unico_idx
  on public.inscricoes (lower(email));

alter table public.inscricoes enable row level security;
```

---

## 5. Criar os buckets

O SQL do passo 4 **já criou os dois buckets**. Só confira:

Menu **Storage** → devem aparecer:

| Bucket | Público? | Limite | Tipos aceitos |
| --- | --- | --- | --- |
| `fotos-candidatos` | Não (privado) | 5 MB | `image/jpeg`, `image/png`, `image/webp` |
| `curriculos-candidatos` | Não (privado) | 10 MB | `application/pdf` |

**Se preferir criar pela interface**, em vez do SQL:

1. **Storage** → **New bucket**
2. Name: `fotos-candidatos`
3. **Public bucket: deixe DESLIGADO** ← importante
4. Abra **Additional configuration**:
   - Restrict file size: `5` MB
   - Allowed MIME types: `image/jpeg,image/png,image/webp`
5. **Save**
6. Repita para `curriculos-candidatos`, com `10` MB e `application/pdf`.

---

## 6. Políticas e configurações necessárias

**Boa notícia: você não precisa criar nenhuma política.**

O motivo: quem fala com o Supabase é sempre a API, usando a `service_role`, e essa chave
ignora as regras de acesso. Como nada além da API toca o banco, o mais seguro é
**deixar tudo fechado**:

| Item | Configuração | Por quê |
| --- | --- | --- |
| Tabela `inscricoes` | RLS **ligado**, **nenhuma** política | Chaves públicas não leem nem escrevem nada |
| Bucket `fotos-candidatos` | **Privado**, sem políticas | Ninguém acessa a foto por URL direta |
| Bucket `curriculos-candidatos` | **Privado**, sem políticas | Idem para o currículo |

O painel administrativo consegue ver as fotos e os currículos porque a API gera
**links temporários assinados**, válidos por 1 hora. Depois disso o link para de funcionar
sozinho — se alguém copiar o endereço, ele expira.

> Se você deixar os buckets **públicos**, qualquer pessoa com o link consegue baixar a foto e
> o currículo de qualquer candidato. Não faça isso — são dados pessoais, e muitos candidatos
> são menores de idade.

---

## 7. Variáveis que o backend precisa

No servidor onde a API roda, crie um arquivo `.env` (copie de `.env.example`):

```bash
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=cole-aqui-a-service-role
ADMIN_PASSWORD=a-senha-do-painel
ADMIN_TOKEN_SECRET=um-valor-aleatorio-longo
PORT=3001
CORS_ORIGIN=https://seu-site.netlify.app
```

Para gerar o `ADMIN_TOKEN_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

No **Netlify** (site), a única variável é:

```bash
VITE_API_URL=https://endereco-da-sua-api
```

---

## 8. Testar uma inscrição

Com o `.env` preenchido, rode os dois:

```bash
npm run dev:all
```

1. Abra `http://localhost:5174`
2. Preencha o formulário até o fim (nome, telefone, e-mail, foto, currículo, origem)
3. Marque o aceite de privacidade
4. Clique em **Enviar minha inscrição**

Se aparecer **"Inscrição recebida!"** com um protocolo (`VS-2026-0001`), deu certo —
essa tela só aparece depois que os arquivos e o registro foram realmente gravados.

Se aparecer erro, olhe o terminal onde a API está rodando: a mensagem detalhada fica lá.

**Conferir se a API enxerga o Supabase:** abra `http://localhost:3001/api/health`.
Deve responder `{"ok":true,"supabase":true}`. Se vier `"supabase":false`, as variáveis
`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` não foram carregadas.

### Testar a trava de e-mail duplicado

Envie uma segunda inscrição usando **o mesmo e-mail** (pode escrever em MAIÚSCULAS, o
sistema trata como o mesmo). Deve aparecer:

> Este e-mail já possui uma inscrição. Se você acredita que isso seja um engano, entre em
> contato com a equipe responsável pelo programa.

Confira que **nada novo foi criado**: a tabela continua com o mesmo número de linhas e o
Storage com a mesma quantidade de arquivos. Numa tentativa duplicada, os arquivos nem
chegam a ser enviados.

---

## 9. Verificar se o candidato foi salvo

No Supabase: menu **Table Editor** → tabela **inscricoes**.

A linha deve estar lá, com `nome_completo`, `telefone`, `email`, `protocolo`,
`created_at` e os caminhos em `foto_path` e `curriculo_path`.

Pelo SQL Editor também funciona:

```sql
select protocolo, nome_completo, email, created_at
from public.inscricoes
order by created_at desc
limit 10;
```

E pelo **painel do site**: acesse `/admin`, entre com a `ADMIN_PASSWORD` e o candidato
deve aparecer na lista.

---

## 10. Verificar se foto e currículo foram armazenados

No Supabase: menu **Storage**.

1. Abra **fotos-candidatos** → deve existir uma pasta com o id do candidato
   (algo como `3f8a2c1e-.../`), e dentro dela o arquivo `foto.jpg` (ou `.png` / `.webp`).
2. Abra **curriculos-candidatos** → mesma pasta, com `curriculo.pdf`.

O nome da pasta é exatamente o `id` da linha na tabela `inscricoes` — é assim que o
registro e os arquivos ficam ligados.

Pelo SQL:

```sql
select name, bucket_id, created_at
from storage.objects
order by created_at desc
limit 10;
```

**Pelo painel:** abra a ficha do candidato em `/admin`. Se a foto aparecer e o botão
*Abrir currículo (PDF)* funcionar, os dois arquivos estão no lugar certo.

---

## Problemas comuns

| O que acontece | Causa provável | Como resolver |
| --- | --- | --- |
| `/api/health` responde `"supabase": false` | `.env` não foi lido | Confira se o `.env` está na raiz do projeto e reinicie a API |
| Erro "Não conseguimos salvar sua foto" | Bucket não existe ou tem outro nome | Rode o `supabase/schema.sql` de novo e confira em **Storage** |
| Erro ao gravar o registro | Tabela não criada | Rode o `supabase/schema.sql` |
| A foto não aparece no painel | Link assinado expirou (1 hora) | Clique no botão de atualizar do painel |
| "Este e-mail já possui uma inscrição" sem motivo | O candidato realmente já se inscreveu | Busque o e-mail no painel `/admin` para confirmar |
| SQL falha com "could not create unique index" | Já existem e-mails repetidos na tabela | Rode a consulta de duplicados do passo 4 e resolva |
| O site em produção dá erro ao enviar | `VITE_API_URL` errada ou `CORS_ORIGIN` sem o domínio do site | Confira as duas variáveis |
| Inscrição some depois de um tempo | Projeto Supabase pausado por inatividade (plano free) | Acesse o painel do Supabase para reativar |

---

## Sobre o plano gratuito

O plano free do Supabase costuma ser suficiente para este programa (500 MB de banco,
1 GB de Storage). Dois pontos de atenção:

- **Projetos sem acesso por ~1 semana são pausados.** Enquanto o período de inscrições
  estiver aberto, isso não acontece; fora dele, basta abrir o painel do Supabase de vez em
  quando.
- **Faça backup** antes de encerrar a seleção: **Table Editor → inscricoes → Export → CSV**,
  e baixe os arquivos do Storage se quiser guardá-los fora.
