# Easy Health — desenvolvimento

Guia técnico para configurar, executar e testar o código do repositório.

## Stack

- **Frontend:** React Native, Expo 51 e JavaScript; Expo também serve a versão web.
- **Backend:** Java 25, Spring Boot 3.5 e JDBC.
- **Banco de dados:** MySQL 8.4.
- **Ambiente local:** Docker Compose.

## Pré-requisitos

- Git.
- Docker com Docker Compose.
- Para desenvolvimento sem Docker: Node.js 20+ e npm; Java 25+ e Maven 3.9+.

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
`easy-health-mysql-data`. Na primeira inicialização desse volume, o Compose executa os
scripts de [docs/SQL](./docs/SQL): `01_easyhealth.sql` cria somente o schema da persistência
principal do app; `02_instituicoes_medicas.sql` cria e `03_dados_exemplo_instituicoes.sql`
preenche o catálogo fictício separado `easyhealth_institutions`, lido pela API; e
`04_dados_exemplo_usuario.sql` adiciona uma conta opcional de demonstração. O usuário MySQL da
aplicação recebe acesso somente de leitura ao catálogo; os registros não representam integrações
ativas com APIs externas. Os guias de primeiros socorros vêm do JSON local do frontend.
O MySQL só executa esses scripts automaticamente quando o volume de dados está vazio;
para bancos já existentes, aplique-os manualmente ou use um volume novo se puder descartar
os dados atuais.

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

As telas de histórico permitem criar, editar e remover registros pessoais. A confirmação de
consulta pode adicionar um evento ao calendário do dispositivo (ou baixar um arquivo `.ics`
pela web), e os detalhes da consulta permitem gerar um resumo informativo em PDF. A foto de
perfil é selecionada na galeria e salva após validação e compressão pela API.

O login com Google fica disponível após configurar Client IDs OAuth no Google Cloud Console:
`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` e
`EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` (conforme as plataformas usadas) no frontend, e
`GOOGLE_OAUTH_CLIENT_IDS` no backend. Configure o cliente Android para o pacote
`br.com.easyhealth.app` e o SHA-1 do certificado que assina o APK. Nunca coloque Client
Secrets no aplicativo. O passo a passo está no [README do frontend](./frontend/README.md#login-com-google).

Configure a URL da API por `EXPO_PUBLIC_API_URL` ou em `frontend/app.json`, no campo
`expo.extra.apiUrl`. O endereço depende do dispositivo: `localhost` para navegador,
`10.0.2.2` para emulador Android e o IP local do computador para celular físico.

### Gerar APK Android

O perfil `preview` do EAS Build gera um APK instalável. É necessário ter uma conta Expo
e acesso à internet; a compilação é feita na nuvem, sem precisar instalar o Android SDK
localmente.

Na primeira vez, entre na pasta `frontend/`, autentique-se e vincule o projeto a uma
conta Expo:

```bash
cd frontend
npx eas-cli@latest login
npx eas-cli@latest init
```

Configure `EXPO_PUBLIC_API_URL` nas variáveis do projeto Expo para o ambiente **preview**.
Use uma URL que o celular consiga acessar (por exemplo, o IP local do computador na mesma
rede Wi-Fi, ou o endereço público do backend); `localhost` e `10.0.2.2` não funcionam em
um celular físico.

Gere o APK:

```bash
npx eas-cli@latest build --platform android --profile preview
```

Ao terminar, baixe o APK pelo link exibido pelo EAS CLI ou no painel do projeto Expo.
Instale-o no dispositivo Android para testar.

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
  src/test/       testes automatizados

docs/SQL/
  01_easyhealth.sql
  02_instituicoes_medicas.sql
  03_dados_exemplo_instituicoes.sql
  04_dados_exemplo_usuario.sql

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
