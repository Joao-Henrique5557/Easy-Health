# Backend do Easy Health

API REST didática feita com **Spring Boot 3**, **Java 17**, **PostgreSQL** e `JdbcTemplate`. Os controllers cuidam das rotas HTTP, os services concentram autenticação e regras simples, e os repositories organizam as consultas ao banco.

## Executar com Docker (recomendado)

Na raiz do repositório:

```bash
cp .env.example .env
docker compose up --build
```

A API fica em `http://localhost:3333`; o Adminer fica em `http://localhost:8080`. O PostgreSQL executa `schema.sql` e `seed.sql` na primeira inicialização. Os scripts usam `CREATE ... IF NOT EXISTS` e `ON CONFLICT`, preservando os dados existentes no volume. A conta de demonstração é `maria.silva@email.com` / `senha123`.

Confira `GET http://localhost:3333/health` para verificar a API e a conexão com o banco. A pasta `requests/` contém chamadas de exemplo para a extensão REST Client do VS Code.

## Executar localmente

1. Inicie um PostgreSQL e crie o banco `easyhealth`.
2. Exporte `DB_URL`, `DB_USER` e `DB_PASSWORD` (os valores locais padrão estão em `application.properties`).
3. No diretório `backend/`, rode:

```bash
mvn test
mvn spring-boot:run
```

Para gerar o JAR executável, use `mvn package`; o arquivo fica em `target/easy-health.jar`. Java 17 ou superior e Maven 3.9+ são necessários.

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

Agendamentos, favoritos, notificações, contas e tokens são persistidos no PostgreSQL. Os catálogos de estabelecimentos/primeiros socorros são dados locais de demonstração; exames, vacinas, medicamentos e documentos ainda retornam listas vazias. Agendamento não confirma disponibilidade real com o hospital.

### Integrações ainda não configuradas

O assistente responde com navegação simples e orientações seguras, sem chamar um provedor de IA. As rotas de geocodificação respondem `503` até que um serviço externo seja configurado; a distância e os hospitais próximos usam coordenadas locais. Recuperação de senha gera um código válido por 15 minutos. Configure `RESET_CODE_LOG_ENABLED=true` **somente em desenvolvimento** para mostrar o código no log do backend; em produção, integre um serviço de e-mail e mantenha essa opção desligada. Verificação de e-mail também requer um serviço de envio.

O conteúdo de primeiros socorros é demonstrativo e não substitui atendimento médico. Ligue para o SAMU pelo 192 em emergências.
