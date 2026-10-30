# Easy Health — desenvolvimento

Guia técnico para configurar, executar e testar o código do repositório.

## Stack

- **Frontend:** React Native, Expo 51 e JavaScript; Expo também serve a versão web.
- **Backend:** Java 17, Spring Boot 3.4 e JDBC.
- **Banco de dados:** MySQL 8.4.
- **Ambiente local:** Docker Compose.

## Pré-requisitos

- Git.
- Docker com Docker Compose.
- Para desenvolvimento sem Docker: Node.js 20+ e npm; Java 17+ e Maven 3.9+.

## Executar com Docker

Na raiz do repositório, prepare o arquivo de ambiente e substitua os valores de senha:

```bash
cp -n .env.example .env
```

Inicie os serviços:

```bash
docker compose up --build
```

Endereços locais:

| Serviço             | Endereço                       |
| ------------------- | ------------------------------ |
| Frontend web (Expo) | `http://localhost:8081`        |
| API                 | `http://localhost:3333`        |
| Healthcheck da API  | `http://localhost:3333/health` |
| Adminer             | `http://localhost:8080`        |

O Adminer é opcional; use `db` como servidor MySQL. Os dados do banco ficam no volume
`easy-health-mysql-data`.

Comandos úteis:

```bash
docker compose ps
docker compose logs -f backend
docker compose up -d --build backend
docker compose down
```

`docker compose down` preserva os dados. Evite `docker compose down -v` se precisar manter
o conteúdo do banco.

## Desenvolvimento local

### Backend

Configure um MySQL local e, no terminal, defina as credenciais de conexão:

```bash
export DB_URL='jdbc:mysql://localhost:3306/easyhealth?serverTimezone=UTC&characterEncoding=UTF-8'
export DB_USER='easyhealth'
export DB_PASSWORD='sua-senha-local'
```

Na pasta `backend/`:

```bash
mvn test
mvn spring-boot:run
```

Para gerar o JAR:

```bash
mvn package
```

O artefato é criado em `backend/target/easy-health.jar`. Alguns testes de integração usam
Testcontainers e precisam de Docker.

### Frontend

Na pasta `frontend/`:

```bash
npm ci
npx expo start
```

Para iniciar a versão web localmente:

```bash
npx expo start --web
```

Configure a URL da API por `EXPO_PUBLIC_API_URL` ou em `frontend/app.json`, no campo
`expo.extra.apiUrl`. O endereço depende do dispositivo: `localhost` para navegador,
`10.0.2.2` para emulador Android e o IP local do computador para celular físico.

## Estrutura técnica

```text
backend/
  src/main/java/br/com/easyhealth/
    config/       configuração e inicialização
    controller/   endpoints HTTP
    dto/          objetos de entrada e saída
    model/        modelos de domínio
    repository/   acesso a dados
    service/      regras de aplicação
  src/main/resources/
    application.properties
    schema.sql
    seed.sql
  src/test/       testes automatizados

frontend/
  src/
    components/   componentes reutilizáveis
    config/       configuração do aplicativo
    data/         dados locais
    hooks/        hooks React
    navigation/   navegação
    screens/      telas
    services/     integração HTTP e serviços
    theme/        estilos e tokens visuais
```

## Convenções de desenvolvimento

- Mantenha controllers focados no protocolo HTTP; concentre regras de aplicação em services
  e acesso ao banco em repositories.
- Valide entradas da API nos DTOs e mantenha respostas e erros consistentes.
- Centralize chamadas à API nos serviços do frontend; não espalhe URLs pelos componentes.
- Nunca versione credenciais. Use `.env` local e mantenha `.env.example` sem segredos.
- Execute os testes do backend antes de enviar mudanças; revise também a configuração Docker
  ao alterar portas, variáveis de ambiente ou serviços.

## Licença

Este repositório está sob a licença MIT. Consulte [LICENSE](./LICENSE).
