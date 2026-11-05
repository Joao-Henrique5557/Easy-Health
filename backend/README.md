# Backend do Easy Health

API REST didática feita com **Spring Boot 3.5**, **Java 25**, **MySQL 8.4** e `JdbcTemplate`. Os controllers cuidam das rotas HTTP, os services concentram autenticação e regras simples, e os repositories organizam as consultas ao banco.

## Executar com Docker (recomendado)

Na raiz do repositório:

```bash
cp -n .env.example .env
```

Se não existir `.env` local, esse comando cria um a partir do exemplo sem sobrescrever arquivos existentes. Se já existir, atualize-o manualmente com as variáveis `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD` e `MYSQL_DATABASE`; substitua as duas senhas por valores fortes antes de iniciar os serviços:

```bash
docker compose up --build
```

A API fica em `http://localhost:3333`; o Adminer fica em `http://localhost:8080` (selecione **MySQL**, servidor `db`). `01_easyhealth.sql` cria somente as tabelas necessárias à persistência do app. Na primeira inicialização do volume, o MySQL também executa `02_instituicoes_medicas.sql` (schema do catálogo separado `easyhealth_institutions`), `03_dados_exemplo_instituicoes.sql` (registros fictícios lidos pela API) e `04_dados_exemplo_usuario.sql` (conta de demonstração). Os dados de catálogo podem ser inseridos novamente sem duplicar os relacionamentos. O volume `easy-health-mysql-data` é novo e separado do volume PostgreSQL anterior. A conta de demonstração é `maria.silva@email.com` / `senha123`.

Confira `GET http://localhost:3333/health` para verificar a API e a conexão com o banco. A pasta `requests/` contém chamadas de exemplo para a extensão REST Client do VS Code.

Para reconstruir e reiniciar somente a API sem remover dados, use `docker compose up -d --build backend` e acompanhe `docker compose logs -f backend`; não use `docker compose down -v`.

### Diagnóstico de conexão no Docker

`db` é o nome DNS interno do serviço MySQL e só resolve para processos conectados à rede do Compose. Inicie a API como serviço Compose, pela raiz do repositório; não use `mvn spring-boot:run` ou `docker run` isolado com uma URL que contenha `db`. Para executar a API diretamente na máquina, use a URL `localhost` do `backend/.env.example`. O Compose configura a URL interna `jdbc:mysql://db:3306/...` para o container da API e aguarda o healthcheck do MySQL antes de iniciá-lo.

Se aparecer `UnknownHostException: db`, confira se os serviços estão na mesma rede e se o backend está usando a URL interna correta:

```bash
docker compose ps
docker compose exec backend getent hosts db
docker compose logs backend
```

## Executar localmente

1. Instale MySQL 8.4 e crie o banco `easyhealth` e um usuário com acesso a ele.
2. Configure as variáveis de ambiente abaixo. `DB_PASSWORD` é obrigatório e não tem senha padrão:

```bash
export DB_URL='jdbc:mysql://localhost:3306/easyhealth?serverTimezone=UTC&characterEncoding=UTF-8'
export DB_USER='easyhealth'
export DB_PASSWORD='substitua-por-uma-senha-local-forte'
```

1. No diretório `backend/`, rode:

```bash
mysql --host=localhost --user=easyhealth --password easyhealth < ../docs/SQL/01_easyhealth.sql
mysql --host=localhost --user=root --password easyhealth < ../docs/SQL/02_instituicoes_medicas.sql
mysql --host=localhost --user=root --password easyhealth < ../docs/SQL/03_dados_exemplo_instituicoes.sql
mysql --host=localhost --user=easyhealth --password easyhealth < ../docs/SQL/04_dados_exemplo_usuario.sql
mvn test
mvn spring-boot:run
```

Por padrão, o backend local lê `../docs/SQL/01_easyhealth.sql`. Se executar o JAR
a partir de outro diretório, defina `SQL_SCRIPTS_DIR` para o caminho absoluto de `docs/SQL`.
`01_easyhealth.sql` contém somente o schema da persistência principal. `02_instituicoes_medicas.sql`
cria o catálogo de exemplo separado `easyhealth_institutions`; `03_dados_exemplo_instituicoes.sql`
insere os dados fictícios consumidos pela API; e `04_dados_exemplo_usuario.sql` adiciona a conta
opcional de demonstração. O Compose executa os quatro scripts na criação inicial do banco.
Para preparar manualmente um volume já existente, aplique `02` antes de `03`:

```bash
docker compose exec -T db sh -c 'mysql --user=root --password easyhealth < /docker-entrypoint-initdb.d/02_instituicoes_medicas.sql'
```

```bash
docker compose exec -T db sh -c \
  'mysql --user=root --password="$MYSQL_ROOT_PASSWORD" < /docker-entrypoint-initdb.d/03_dados_exemplo_instituicoes.sql'
```

O teste de inicialização usa um container MySQL via Testcontainers; ele é ignorado quando Docker não está disponível. Para gerar o JAR executável, use `mvn package`; o arquivo fica em `target/easy-health.jar`. Java 25 ou superior e Maven 3.9+ são necessários.

## Banco de dados e migração

`docs/SQL/01_easyhealth.sql` contém somente as tabelas de persistência. A conta de demonstração fica em `04_dados_exemplo_usuario.sql`; o catálogo de instituições fica no banco separado `easyhealth_institutions`, criado por `02_instituicoes_medicas.sql` e preenchido por `03_dados_exemplo_instituicoes.sql`. A API lê esse catálogo e o usuário da aplicação recebe acesso somente de leitura. Primeiros socorros são conteúdo estático do app em `frontend/src/data/firstAidGuides.json` e não são duplicados no MySQL. Para volumes existentes, execute os scripts `02` e `03` manualmente antes de atualizar o backend; tabelas antigas de catálogo ou primeiros socorros no banco principal não são mais consultadas nem removidas automaticamente. Alterações futuras nos schemas devem ser acompanhadas por migrações explícitas em `docs/SQL`.

A troca de PostgreSQL para MySQL **não converte nem copia dados automaticamente**. Não monte no MySQL o volume PostgreSQL antigo e não aponte o MySQL para um dump PostgreSQL sem conversão de tipos, arrays/JSON, identificadores e sequências. Faça backup do banco anterior e planeje uma exportação/conversão/importação separada antes de migrar dados de produção.

As credenciais de conexão são fornecidas por `DB_URL`, `DB_USER` e `DB_PASSWORD` (ou pelo Compose via `MYSQL_*`). O script oficial cria também as tabelas `oauth_identities` e `medical_history_records`. Não armazene valores reais em arquivos versionados; use `.env.example` somente como modelo com placeholders.

## Organização do código

```text
src/main/java/br/com/easyhealth/
  config/       CORS e codificação de senha
  controller/   rotas HTTP e tratamento de erros
  dto/          dados validados recebidos pela API
  model/        modelo de usuário
  repository/   consultas e alterações SQL
  service/      autenticação, tokens e regras de negócio
src/main/resources/
  application.properties

../docs/SQL/
  01_easyhealth.sql
  02_instituicoes_medicas.sql
  03_dados_exemplo_instituicoes.sql
  04_dados_exemplo_usuario.sql
```

Os tokens de acesso e renovação são opacos, aleatórios, guardados no banco somente como hashes SHA-256 e têm expiração distinta. Senhas são armazenadas com BCrypt. Rotas privadas aceitam `Authorization: Bearer <token>`; `accessToken` na query string existe apenas para os exemplos do REST Client.

## Rotas disponíveis

- `GET /health`
- `POST /api/auth/{register,login,refresh-token,logout,forgot-password,reset-password,verify-email}`
- `POST /api/auth/google` — valida ID token do Google; requer `GOOGLE_OAUTH_CLIENT_IDS`
- `/api/users/me` (perfil, avatar, senha, token de push e preferências)
- `/api/estabelecimentos`, `/api/especialidades`
- `/api/emergencia` (contatos, hospitais próximos e distância em linha reta)
- `/api/agendamentos`, `/api/historico`, `/api/favoritos`, `/api/notificacoes`
- `/api/localizacao` e `POST /api/assistant/message`

Agendamentos, favoritos, notificações, contas, tokens e registros pessoais em
`/api/historico/registros` são persistidos no MySQL. Os catálogos de estabelecimentos/primeiros
socorros são dados locais de demonstração. Agendamento não confirma disponibilidade real com
o hospital.

### OAuth Google e configurações

Defina `GOOGLE_OAUTH_CLIENT_IDS` no ambiente do backend como a lista separada por vírgula de
todos os Client IDs aceitos (Web/Android/iOS). Configure os Client IDs de cada plataforma no
frontend por `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` e
`EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`. Veja o passo a passo no [README do frontend](../frontend/README.md#login-com-google).
Não compartilhe nem inclua Client Secrets no aplicativo. Sem Client IDs, a rota Google responde
`503` e o login com senha continua disponível.

O PDF da consulta é um resumo informativo e não constitui receita, atestado ou laudo clínico.
Registros pessoais do histórico são inseridos pela própria pessoa usuária; não substituem
documentos clínicos emitidos por profissionais.

### Integrações ainda não configuradas

O assistente responde com navegação simples e orientações seguras, sem chamar um provedor de IA. As rotas de geocodificação respondem `503` até que um serviço externo seja configurado; a distância e os hospitais próximos usam coordenadas locais. Recuperação de senha gera um código válido por 15 minutos. Configure `RESET_CODE_LOG_ENABLED=true` **somente em desenvolvimento** para mostrar o código no log do backend; em produção, integre um serviço de e-mail e mantenha essa opção desligada. Verificação de e-mail também requer um serviço de envio.

O conteúdo de primeiros socorros é demonstrativo e não substitui atendimento médico. Ligue para o SAMU pelo 192 em emergências.
