# Backend do Easy Health

API REST didática feita com **Spring Boot 3**, **Java 17**, **MySQL 8.4** e `JdbcTemplate`. Os controllers cuidam das rotas HTTP, os services concentram autenticação e regras simples, e os repositories organizam as consultas ao banco.

## Executar com Docker (recomendado)

Na raiz do repositório:

```bash
cp -n .env.example .env
```

Se não existir `.env` local, esse comando cria um a partir do exemplo sem sobrescrever arquivos existentes. Se já existir, atualize-o manualmente com as variáveis `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD` e `MYSQL_DATABASE`; substitua as duas senhas por valores fortes antes de iniciar os serviços:

```bash
docker compose up --build
```

A API fica em `http://localhost:3333`; o Adminer fica em `http://localhost:8080` (selecione **MySQL**, servidor `db`). Na inicialização, o Spring aplica `schema.sql` e carrega `seed.sql`; as tabelas são criadas se ainda não existirem e os seeds não sobrescrevem dados de usuário/catálogo já alterados. O volume `easy-health-mysql-data` é novo e separado do volume PostgreSQL anterior. A conta de demonstração é `maria.silva@email.com` / `senha123`.

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

3. No diretório `backend/`, rode:

```bash
mvn test
mvn spring-boot:run
```

O teste de inicialização usa um container MySQL via Testcontainers; ele é ignorado quando Docker não está disponível. Para gerar o JAR executável, use `mvn package`; o arquivo fica em `target/easy-health.jar`. Java 17 ou superior e Maven 3.9+ são necessários.

## Banco de dados e migração

`schema.sql` usa tipos JSON para listas do catálogo e DDL idempotente para criar as tabelas do MySQL. `seed.sql` pode ser executado novamente sem redefinir senhas de usuários ou substituir dados de catálogo já existentes. Alterações futuras no schema de instalações existentes devem ser acompanhadas por uma migração explícita.

A troca de PostgreSQL para MySQL **não converte nem copia dados automaticamente**. Não monte no MySQL o volume PostgreSQL antigo e não aponte o MySQL para um dump PostgreSQL sem conversão de tipos, arrays/JSON, identificadores e sequências. Faça backup do banco anterior e planeje uma exportação/conversão/importação separada antes de migrar dados de produção.

As credenciais de conexão são fornecidas por `DB_URL`, `DB_USER` e `DB_PASSWORD` (ou pelo Compose via `MYSQL_*`). Não armazene valores reais em arquivos versionados; use `.env.example` somente como modelo com placeholders.

## Organização do código

```text
src/main/java/br/com/easyhealth/
  config/       CORS, codificação de senha e inicialização de dados
  controller/   rotas HTTP e tratamento de erros
  dto/          dados validados recebidos pela API
  model/        modelo de usuário
  repository/   consultas e alterações SQL
  service/      autenticação, tokens e regras de negócio
src/main/resources/
  application.properties
  schema.sql
  seed.sql
```

Os tokens de acesso e renovação são opacos, aleatórios, guardados no banco somente como hashes SHA-256 e têm expiração distinta. Senhas são armazenadas com BCrypt. Rotas privadas aceitam `Authorization: Bearer <token>`; `accessToken` na query string existe apenas para os exemplos do REST Client.

## Rotas disponíveis

- `GET /health`
- `POST /api/auth/{register,login,refresh-token,logout,forgot-password,reset-password,verify-email}`
- `/api/users/me` (perfil, avatar, senha, token de push e preferências)
- `/api/primeiros-socorros`, `/api/estabelecimentos`, `/api/especialidades`
- `/api/emergencia` (contatos, hospitais próximos e distância em linha reta)
- `/api/agendamentos`, `/api/historico`, `/api/favoritos`, `/api/notificacoes`
- `/api/localizacao` e `POST /api/assistant/message`

Agendamentos, favoritos, notificações, contas e tokens são persistidos no MySQL. Os catálogos de estabelecimentos/primeiros socorros são dados locais de demonstração; exames, vacinas, medicamentos e documentos ainda retornam listas vazias. Agendamento não confirma disponibilidade real com o hospital.

### Integrações ainda não configuradas

O assistente responde com navegação simples e orientações seguras, sem chamar um provedor de IA. As rotas de geocodificação respondem `503` até que um serviço externo seja configurado; a distância e os hospitais próximos usam coordenadas locais. Recuperação de senha gera um código válido por 15 minutos. Configure `RESET_CODE_LOG_ENABLED=true` **somente em desenvolvimento** para mostrar o código no log do backend; em produção, integre um serviço de e-mail e mantenha essa opção desligada. Verificação de e-mail também requer um serviço de envio.

O conteúdo de primeiros socorros é demonstrativo e não substitui atendimento médico. Ligue para o SAMU pelo 192 em emergências.
