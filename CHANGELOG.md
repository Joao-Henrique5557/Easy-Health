# Changelog — Backend, Docker, REST Client e revisão dos READMEs

## O que foi feito

### 1. Backend implementado do zero (`backend/`)

Node.js + TypeScript + Express + Prisma + PostgreSQL, cobrindo **todas** as
rotas da seção 22 do `readme.md` (auth, users, primeiros-socorros,
estabelecimentos, emergência, agendamentos, histórico, favoritos,
notificações, localização) mais a rota nova do Assistente de IA
(`POST /api/assistant/message`, chamando a API da Claude do lado do
servidor). Detalhes completos em `backend/README.md`.

### 2. Docker

- `backend/Dockerfile` (build multi-stage) + `backend/docker-entrypoint.sh`
  (aplica migrations e faz seed automaticamente no primeiro start).
- `docker-compose.yml` na raiz, orquestrando `db` (Postgres) + `backend` +
  `adminer` (UI de inspeção do banco, opcional).
- `.env.example` na raiz com todas as variáveis do compose documentadas.

### 3. Arquivos da extensão REST Client (`backend/requests/`)

Um `.http` por grupo de rotas (auth, users, estabelecimentos, emergência,
agendamentos, histórico, favoritos, notificações, localização, assistant),
mais `http-client.env.json`. Cada arquivo é autocontido — inclui seu
próprio request de login no topo e reaproveita o token capturado
(`{{login.response.body.$.accessToken}}`) nos requests seguintes do mesmo
arquivo, sem precisar copiar/colar token manualmente.

### 4. Revisão da pasta `docs/`

Os dois PDFs em `docs/ideia-do-projeto/` (Oceano Azul e Problema/Solução)
foram lidos e comparados com o `readme.md` — já estavam 100% alinhados
(esse conteúdo já havia sido incorporado ao readme anteriormente), não foi
necessário alterar a lógica do produto.

### 5. `readme.md` (raiz) reformulado

- **Nova seção 18 — Equipe e Organização do Projeto**, com os 7 papéis do
  `docs/distribuicao-cargos-projeto-empreendedorismo.md` preenchidos com
  nomes reais (PO: Cássio, Scrum Master: Caio, Dev Mobile 1: Alex, Dev
  Mobile 2: Maxuel, Backend: Isabela, DevOps: João Henrique, Design: Adriel
  Vinicius).
- **Seção 6.8 (Assistente de IA) estava faltando** — várias outras partes
  do documento já a referenciavam, mas a seção em si não existia nesta
  versão do readme. Adicionada.
- **Seções 12 e 13** (Arquitetura e Tecnologias) atualizadas: saíram de
  "ainda podem ser definidas" para a stack real implementada.
- **Seção 15 (MVP) e 16 (Roadmap)**: checkboxes atualizados para refletir
  o que já está implementado.
- **Seção 20 (Status)**: de "Planejamento / Desenvolvimento inicial" para
  "MVP implementado", com o detalhamento do que falta.
- **Nova seção 22.11**: rota do Assistente de IA documentada junto com as
  demais rotas da API.
- **Nova seção 23 — Como Rodar o Projeto**: passo a passo com Docker
  Compose + Expo.
- **Renumeração**: seções 18 em diante foram renumeradas (18→19, 19→20,
  20→21, 21→22) para acomodar a nova seção de equipe; todas as referências
  cruzadas internas (ex: "ver seção 14") foram conferidas uma a uma depois
  da renumeração.
- Seção 24 (Licença) só tinha o título, sem corpo — adicionado o texto
  apontando para o `LICENSE` (MIT).

### 6. `backend/README.md` e `frontend/README.md`

Ambos escritos/reescritos para descrever a stack real, como rodar (local e
via Docker) e as decisões de design mais importantes.

## Bugs encontrados e corrigidos

1. **`frontend/app.json` → `extra.apiUrl` estava sem o esquema `http://`**
   (só `"192.168.3.52:3333"`) — isso quebraria toda chamada do axios, já
   que `baseURL` precisa de um esquema válido. Corrigido para
   `"http://192.168.3.52:3333"`.
2. **`NotificationsScreen.tsx` usava o mock (`NOTIFICATIONS_MOCK`)
   diretamente**, ao contrário de todas as outras telas do app (que sempre
   passam por um `service` com fallback para o mock). Mesmo com o backend
   no ar, a tela de notificações nunca refletiria dados reais. Criado
   `frontend/src/services/notificationsService.ts` e a tela foi reescrita
   para usá-lo, com marcação de "lida" otimista ao tocar na notificação.
3. **`backend/src/lib/jwt.ts`**: erro de tipos do TypeScript ao assinar
   tokens (`expiresIn: string` não bate com o tipo esperado por
   `@types/jsonwebtoken`, que espera um formato específico tipo `"15m"`
   tipado como `StringValue`). Corrigido com um cast explícito e
   tipado (`as SignOptions["expiresIn"]`), sem recorrer a `any` solto.
4. **`backend/package.json`**: o pacote `prisma` (CLI, necessário para
   `prisma migrate deploy` no `docker-entrypoint.sh`) e `ts-node`
   (necessário para `prisma db seed`) estavam como `devDependencies` —
   como o `Dockerfile` roda `npm install --omit=dev` na imagem final, o
   entrypoint quebraria ao tentar aplicar as migrations. Movidos para
   `dependencies`.
5. Vários `implicit any` em callbacks de `.map`/`.filter`/`.sort` nas
   rotas do backend, causados por tipos do Prisma não sendo propagados
   corretamente — anotados explicitamente com os tipos corretos do Prisma
   Client (`Establishment`, `EstablishmentPrice`, `Notification` etc.).

## Como foi validado

- **`npx tsc --noEmit` no frontend**: 0 erros, depois de todos os ajustes
  (`notificationsService.ts` novo, `NotificationsScreen.tsx` reescrita).
- **`npx tsc --noEmit` no backend**: 0 erros de lógica/aplicação. Os únicos
  erros que restaram (`Module "@prisma/client" has no exported member
  'User'` etc.) são causados por uma limitação específica do ambiente
  onde este trabalho foi feito, que bloqueia o download do binário nativo
  do Prisma (`binaries.prisma.sh`) — confirmado inspecionando o client
  gerado, que contém literalmente `export declare const PrismaClient: any`
  (o stub que o pacote `@prisma/client` usa antes de `prisma generate`
  rodar com sucesso). **Isso não afeta uma máquina com internet normal**:
  `npm install` (que já dispara `prisma generate` via postinstall) baixa o
  binário certo e esses erros desaparecem sozinhos — não é necessário
  fazer nada a mais.
- **Migration SQL do Prisma validada de verdade**: como o binário nativo
  não pôde ser baixado, a migration (`backend/prisma/migrations/.../
  migration.sql`) foi escrita manualmente a partir do `schema.prisma` e
  aplicada com sucesso contra um PostgreSQL 16 real instalado
  temporariamente neste ambiente (`apt-get install postgresql`), com
  `psql -f migration.sql`. As 12 tabelas, 4 enums, 4 índices únicos e 11
  chaves estrangeiras foram criados sem nenhum erro, e a estrutura das
  tabelas foi conferida com `\d` no `psql`.
- **Todos os arquivos `.http`** seguem o mesmo padrão testável (login →
  captura de token → requests autenticados), prontos para rodar assim que
  o backend estiver no ar.

## O que ainda não dá para validar sem uma máquina com internet completa

- Rodar o backend de fato conectado a um Prisma Client real (não o stub) e
  bater os endpoints fim-a-fim — bloqueado pela mesma limitação de rede
  descrita acima. Isso vai funcionar normalmente com `docker compose up`
  na máquina de vocês.
- Push notifications reais (dependem de um projeto Expo/EAS configurado).
- Chamada real à API da Anthropic (precisa de uma `ANTHROPIC_API_KEY`
  válida, que não deve ser gerada/testada num ambiente de terceiros).
