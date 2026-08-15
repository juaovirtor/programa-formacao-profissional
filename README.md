# Programa de Formação Profissional — Group Phoenix

Landing page de inscrição do Programa de Formação Profissional, uma iniciativa da
**Visual Software & Informática**, empresa do **Group Phoenix**, em Reserva - PR.

- **Site público:** `/` — apresenta o programa e recebe as inscrições
- **Painel da equipe:** `/admin` — lista os candidatos e organiza a seleção

---

## Arquitetura

```
   Navegador                Netlify              API Node.js            Supabase
  ┌──────────┐          ┌────────────┐         ┌────────────┐      ┌──────────────┐
  │ Candidato│ ───────► │ site (dist)│ ──────► │ valida     │ ───► │ Postgres     │
  │          │          │ React/Vite │  HTTPS  │ e grava    │      │ (inscricoes) │
  └──────────┘          └────────────┘         └────────────┘      │              │
                                                      │            │ Storage      │
                                                      └──────────► │ (2 buckets)  │
                                                                   └──────────────┘
```

| Camada | Onde fica |
| --- | --- |
| Site | **Netlify** (arquivos estáticos) |
| API | **Serviço Node** separado (Render, Railway, Fly.io…) |
| Banco de dados | **Supabase PostgreSQL** — tabela `inscricoes` |
| Arquivos (foto e currículo) | **Supabase Storage** — buckets privados |

Nada é gravado no disco do servidor da API: os arquivos passam pela memória e vão direto
para o Storage. Isso permite hospedar a API em qualquer serviço, inclusive os que apagam o
disco a cada deploy.

Stack do site: React + Vite + Tailwind CSS v4 + Framer Motion + Lucide.

---

## Comandos

| O que fazer | Comando |
| --- | --- |
| Instalar as dependências | `npm install` |
| Rodar **o site** | `npm run dev` |
| Rodar **a API** | `npm run api` |
| Rodar os dois juntos | `npm run dev:all` |
| Gerar o build de produção | `npm run build` |
| Ver o build gerado | `npm run preview` |

```bash
npm install
```

```bash
npm run dev:all
```

```bash
npm run build
```

Site em `http://localhost:5174`, API em `http://localhost:3001`.
**O build gera a pasta `dist/`** — é ela que vai para o Netlify.

---

## Configuração

**Antes de rodar, configure o Supabase.** O passo a passo completo está em
[`SUPABASE_SETUP.md`](SUPABASE_SETUP.md) — leva uns 10 minutos e não exige saber banco de dados.

Depois, copie o modelo de variáveis:

```bash
copy .env.example .env
```

### Variáveis de ambiente

| Variável | Onde vive | Para que serve |
| --- | --- | --- |
| `VITE_API_URL` | **site** (Netlify) | endereço da API |
| `SUPABASE_URL` | **API** | URL do projeto no Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **API** | chave de acesso total ao Supabase |
| `ADMIN_PASSWORD` | **API** | senha do painel `/admin` |
| `ADMIN_TOKEN_SECRET` | **API** | assina o token de sessão do painel |
| `PORT` | **API** | porta (padrão `3001`) |
| `CORS_ORIGIN` | **API** | domínios autorizados a chamar a API |

> ⚠️ **Tudo que começa com `VITE_` fica visível no navegador.**
> A `SUPABASE_SERVICE_ROLE_KEY`, a `ADMIN_PASSWORD` e o `ADMIN_TOKEN_SECRET` existem
> **somente no servidor da API** — nunca no Netlify, nunca com prefixo `VITE_`.
> O `.env` está no `.gitignore` e não vai para o GitHub.

---

## Publicar

### 1. Supabase

Siga o [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md): criar o projeto, rodar o
[`supabase/schema.sql`](supabase/schema.sql) e conferir os buckets.

### 2. API

Hospede a pasta do projeto em um serviço que rode Node 22.

- **Build command:** `npm install`
- **Start command:** `npm run api`
- **Variáveis:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`,
  `ADMIN_TOKEN_SECRET`, `CORS_ORIGIN`

Confira em `https://sua-api/api/health` — deve responder `{"ok":true,"supabase":true}`.

### 3. Site no Netlify

O [`netlify.toml`](netlify.toml) já está configurado (build, publish e redirect de SPA).

1. Suba o projeto para o GitHub.
2. Netlify → *Add new site → Import an existing project* → escolha o repositório.
3. Em *Site configuration → Environment variables*, adicione:
   `VITE_API_URL` = endereço da API
4. **Deploy**.

Depois, volte na API e coloque o endereço do site em `CORS_ORIGIN`.

---

## Como uma inscrição é gravada

1. O site envia os dados e os dois arquivos para `POST /api/inscricoes`.
2. A API **valida tudo de novo** (nome, telefone, e-mail, foto, currículo, consentimento).
   O navegador pode ser contornado — quem decide é o servidor.
3. Sobe a **foto** para o bucket `fotos-candidatos`.
4. Sobe o **currículo** para o bucket `curriculos-candidatos`.
5. Cria o registro na tabela `inscricoes` com os caminhos dos arquivos.
6. Só então responde sucesso, com o protocolo (`VS-2026-0001`).

**Antes de tudo isso**, a API confere se o e-mail já tem inscrição. Se tiver, responde
`409` na hora — sem subir nenhum arquivo. A garantia real é um índice único em
`lower(email)` no banco: mesmo que dois envios cheguem no mesmo instante, só um entra, e os
arquivos do que foi barrado são apagados.

**Se qualquer etapa falhar**, a API apaga os arquivos que já subiram (para não deixar
arquivo órfão), responde erro, e o candidato vê uma mensagem pedindo para tentar de novo.
**A tela de "Inscrição recebida" nunca aparece sem gravação confirmada.**

Os arquivos ficam em uma pasta com o mesmo `id` do registro:
`fotos-candidatos/<id>/foto.jpg` e `curriculos-candidatos/<id>/curriculo.pdf`.

O envio está isolado em [`src/lib/api.js`](src/lib/api.js) (frontend) e
[`server/lib/inscricoes.js`](server/lib/inscricoes.js) (backend).

---

## Estrutura

```
index.html              página base (título, meta tags, favicon)
netlify.toml            configuração de publicação do site
vite.config.js          build e servidor de desenvolvimento
package.json            dependências e comandos
.env.example            modelo das variáveis de ambiente
SUPABASE_SETUP.md       passo a passo do Supabase

supabase/
└── schema.sql          SQL da tabela e dos buckets

public/                 servido como está
├── robots.txt
└── assets/             logos, favicons e a foto do hero

src/                    SITE
├── main.jsx            escolhe entre o site (/) e o painel (/admin)
├── App.jsx             monta as seções
├── index.css           cores, fontes e utilitários da identidade
├── data/program.js     TODO o conteúdo em texto
├── lib/
│   ├── api.js          envio da inscrição
│   ├── adminApi.js     chamadas do painel
│   └── validation.js   máscara de telefone e validações
├── components/
│   ├── layout/         Header, Footer, Intro, MobileCta
│   ├── sections/       as 12 seções
│   ├── form/           formulário em 4 etapas
│   └── ui/             peças reutilizáveis
└── admin/              painel da equipe

server/                 API (não vai para o Netlify)
├── index.js            rotas
└── lib/
    ├── supabase.js     cliente do Supabase (service role)
    ├── inscricoes.js   uploads + gravação + links assinados
    ├── validacao.js    regras de validação do servidor
    └── auth.js         login do painel

brand/                  artes originais (não entram no build)
```

### Arquivos que não devem ser apagados

- `index.html`, `netlify.toml`, `vite.config.js`, `package.json`, `package-lock.json`
- tudo dentro de `src/`, `server/`, `public/` e `supabase/`
- `.env.example`, `.gitignore`, `SUPABASE_SETUP.md`

`dist/` é gerada pelo build e pode ser apagada. `brand/` guarda as artes originais e não é
usada pelo site.

---

## API

| Método | Rota | O que faz |
| --- | --- | --- |
| `GET` | `/api/health` | diz se a API está de pé e se enxerga o Supabase |
| `POST` | `/api/inscricoes` | recebe a inscrição (multipart/form-data) |
| `POST` | `/api/admin/login` | `{ senha }` → `{ token }` |
| `GET` | `/api/admin/inscricoes` | lista os candidatos + indicadores |
| `GET` | `/api/admin/inscricoes/:id` | ficha de um candidato |
| `PATCH` | `/api/admin/inscricoes/:id` | altera `status` e `observacoes` |

As rotas `/api/admin/*` exigem `Authorization: Bearer <token>`.

Campos de `POST /api/inscricoes`:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `nome` | texto | nome e sobrenome |
| `telefone` | texto | 10 ou 11 dígitos |
| `email` | texto | formato válido |
| `foto` | arquivo | JPG, PNG ou WEBP · até 5 MB |
| `curriculo` | arquivo | PDF · até 10 MB |
| `origem` | texto | uma das opções da lista |
| `origem_outro` | texto | obrigatório quando `origem = "Outro"` |
| `consentimento` | texto | precisa ser `"true"` |
| `consentimento_texto` | texto | texto do aceite (registro LGPD) |

Respostas: `201` inscrição criada · `400` dado inválido · **`409` e-mail já inscrito** ·
`502` falha ao gravar no Supabase · `503` Supabase não configurado.

---

## O painel da equipe (`/admin`)

Acesso pelo ícone de perfil no canto superior direito do site.

- Indicadores: inscrições, novos, em análise e selecionados
- Busca por nome, e-mail, telefone ou protocolo, e filtro por situação
- Ficha: foto, telefone, e-mail, origem, data da inscrição, currículo em PDF e observações
- Contato em um clique: WhatsApp com mensagem pronta, e-mail e telefone
- Situação: Novo → Em análise → Selecionado / Não selecionado

Os dados vêm do Supabase. Como os buckets são privados, a foto e o currículo são exibidos
por **links assinados com validade de 1 hora** — depois disso o link expira sozinho. Se as
imagens pararem de aparecer, clique no botão de atualizar do painel.

---

## Privacidade e LGPD

- O candidato precisa **marcar o aceite** antes de enviar. O site e a API recusam sem isso.
- O texto do aceite e a data/hora ficam gravados na própria linha do candidato
  (`consentimento_texto`, `consentimento_em`) — é a prova de consentimento.
- O **Aviso de Privacidade** completo abre em modal, no formulário e no rodapé.
  Conteúdo em `src/data/program.js` → `privacidade`.
- **Pedido de exclusão:** apague a linha em `inscricoes` (Supabase → Table Editor) e os
  arquivos da pasta `<id>/` nos dois buckets (Supabase → Storage).
- Buckets **privados** e tabela com **RLS ligado**: nada é acessível por chave pública.

---

## Editar o conteúdo

Quase todo o texto está em [`src/data/program.js`](src/data/program.js):

| O que mudar | Onde |
| --- | --- |
| Nomes das marcas | `marca` |
| Itens do menu | `nav` |
| Faixa de destaques (4 semanas, gratuito…) | `highlights` |
| Os 6 cards de conteúdo | `modules` |
| Habilidades comportamentais | `softSkills` |
| Bloco "todo mundo tem espaço" | `inclusao` |
| Números de experiência (25 anos, 800 cidades…) | `experiencia` |
| Bloco sobre Reserva · PR | `local` |
| Cards de "Por que participar" | `reasons` |
| Etapas da timeline | `steps` |
| Informações do programa | `programInfo` |
| Opções de "Como conheceu" | `originOptions` |
| WhatsApp e Instagram | `contact` |
| Aviso de Privacidade | `privacidade` |

---

## Imagens

| Arquivo | Onde aparece |
| --- | --- |
| `public/assets/logo-grupo-phoenix.png` | header, rodapé, abertura e painel |
| `public/assets/logo-visual-software.png` | bloco "Uma iniciativa", no rodapé |
| `public/assets/hero-jovem.png` | foto da primeira dobra (proporção 4:5) |
| `public/assets/favicon-32.png` · `favicon-512.png` · `apple-touch-icon.png` | ícone da aba |

**A trocar quando houver material definitivo:** `hero-jovem.png` é um recorte da arte de
campanha (`brand/imagem exemplo.png`). Ao receber uma foto própria, substitua o arquivo
mantendo o nome e a proporção retrato. Nenhum código muda.

---

## Identidade visual

- Fundo preto azulado `#04060d` → `#0b1120`
- Azul `#2b8cff` · Roxo `#8b5cf6` · Verde-limão `#c8f532` · Branco
- Tipografia: **Poppins** (títulos) + **Inter** (texto)
- Tokens em `src/index.css`, bloco `@theme`

---

## Observações

- O `vite.config.js` tem um ajuste para o nome da pasta do projeto (acento + espaço), que no
  Windows pode chegar ao Vite no formato curto `PROGRA~1`. Afeta só o desenvolvimento local.
- A comunicação deixa explícito que o programa **não é promessa de emprego**.
- Responsividade verificada em 320, 375, 768, 1366 e 1920 px — sem rolagem horizontal.

---

Desenvolvido por João Vitor Ribas.
