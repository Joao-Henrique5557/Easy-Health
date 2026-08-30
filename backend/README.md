# Easy Health — Backend

API REST do Easy Health, implementada a partir da seção 21 (Rotas de API) do
[readme do projeto](../readme.md).

## Stack

- **Node.js + TypeScript + Express**
- **PostgreSQL + Prisma ORM** (schema em `prisma/schema.prisma`)
- **JWT** (access token de vida curta + refresh token com rotação, guardado
  hasheado no banco — nunca em texto puro)
- **Zod** para validação de entrada em todas as rotas
- **Docker + Docker Compose** para orquestrar API + banco

## Como rodar

A forma recomendada é via Docker Compose, na **raiz do projeto** (não
aqui dentro de `backend/`):

```bash
cp .env.example .env
# edite o .env se quiser (principalmente ANTHROPIC_API_KEY, se for testar o assistente de IA)
docker compose up --build
```

Isso sobe três serviços:

| Serviço  | Porta padrão | O que é |
| -------- | ------------ | ------- |
| `db`       | 5432 | PostgreSQL |
| `backend`  | 3333 | Esta API |
| `adminer`  | 8080 | UI web para inspecionar o banco (opcional) |

Na primeira subida, o container do backend aplica as migrations do Prisma
automaticamente e popula o banco com dados de demonstração (mesmo conteúdo
do design: Hospital São Lucas, guias de primeiros socorros, usuário
`maria.silva@email.com` / senha `senha123`) — ver `docker-entrypoint.sh` e
`prisma/seed.ts`. Para desativar o seed automático, defina
`SEED_ON_START=false` no `.env`.

### Rodando sem Docker (desenvolvimento local)

Precisa de um PostgreSQL rodando localmente.

```bash
cd backend
cp .env.example .env   # ajuste DATABASE_URL para localhost
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

## Testando as rotas (extensão REST Client)

A pasta `requests/` tem um arquivo `.http` por grupo de rotas (auth, users,
estabelecimentos, agendamentos etc.), prontos para rodar com a extensão
[**REST Client**](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
do VS Code. Cada arquivo já inclui um request de login no topo — o token
é capturado automaticamente (`{{login.response.body.$.accessToken}}`) e
reutilizado nos requests seguintes do mesmo arquivo. Selecione o ambiente
"dev" (`http-client.env.json`) no canto inferior direito do VS Code antes
de rodar.

## Estrutura de pastas

```
backend/
  prisma/
    schema.prisma       modelo de dados (espelha os types do frontend)
    migrations/          histórico de migrations SQL
    seed.ts               popula o banco com dados de demonstração
  requests/                arquivos .http do REST Client
  src/
    app.ts                 monta o Express + todas as rotas
    server.ts               ponto de entrada (só chama app.listen)
    env.ts                   variáveis de ambiente centralizadas
    lib/                      jwt, hash de senha/token, distância geográfica
    middleware/                auth (Bearer Token), tratamento de erros
    modules/
      auth/                     seção 21.1 do readme
      users/                     seção 21.2
      firstAid/                  seção 21.3
      establishments/            seção 21.4 (+ especialidades)
      emergency/                 seção 21.5
      bookings/                  seção 21.6
      history/                   seção 21.7
      favorites/                 seção 21.8
      notifications/             seção 21.9
      location/                  seção 21.10
      assistant/                  rota nova, para o Assistente de IA (seção 6.8)
```

Cada módulo segue o mesmo padrão: `*.routes.ts` (rotas Express),
`*.validators.ts` (schemas Zod) e, quando o modelo do Prisma não bate 1:1
com o formato esperado pelo frontend, um `*.mapper.ts` que faz essa
conversão explicitamente — assim o contrato da API fica sempre visível no
código, não escondido dentro de um `select`/`include` genérico.

## Decisões de design importantes

- **Rotas de emergência são públicas** (`/api/emergencia/*`), mesmo todo o
  resto exigindo token — informação de socorro não pode depender de login
  válido. Mesmo princípio de segurança que já guiou o frontend (o app
  nunca liga sozinho, só abre o discador).
- **Refresh token com rotação**: cada uso invalida o token anterior e emite
  um par novo. Reduz o impacto de um refresh token vazado.
- **`/api/assistant/message`** é uma rota nova (não estava na seção 21
  original do readme) — chama a API da Anthropic **do lado do servidor**,
  nunca do celular, para a chave de API nunca ficar exposta no app. Sem
  `ANTHROPIC_API_KEY` configurada, responde com uma mensagem de fallback
  em vez de quebrar.
- **Exames, vacinas, medicamentos e documentos médicos** (seção 21.7) têm
  rotas implementadas mas sem tabela própria ainda — são "Prioridade
  futura" no roadmap do readme (seção 16). Retornam listas vazias em vez
  de erro, para o frontend continuar funcionando normalmente.
- **Geocodificação** usa a API pública do Nominatim (OpenStreetMap), sem
  exigir chave — decisão tomada na pesquisa de APIs do projeto como
  alternativa gratuita ao Google Geocoding.

## Sobre a validação deste backend

Todo o código foi validado com `npx tsc --noEmit` (zero erros) e o schema
do banco foi validado rodando a migration de verdade contra um PostgreSQL
real (não só revisado visualmente). Detalhes completos de como isso foi
feito — e da única limitação encontrada (ambiente de build sem acesso ao
`binaries.prisma.sh`, que não afeta uma máquina com internet normal) —
estão no `CHANGELOG.md` na raiz do projeto.
