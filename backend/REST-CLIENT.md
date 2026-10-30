# Como usar o REST Client

O projeto já possui exemplos prontos na pasta `backend/requests`. A extensão **REST Client** permite testar a API sem Postman e sem escrever um programa separado.

## Preparação

1. Instale a extensão **REST Client** no VS Code.
2. Inicie a aplicação com `docker compose up --build`.
3. Abra um arquivo `.http`. O endereço da API está na variável `@baseUrl`, no topo de cada arquivo (`http://localhost:3333`), então não é preciso escolher ambiente. O `http-client.env.json` é lido apenas pelo HTTP Client do JetBrains; o REST Client do VS Code o ignora.
4. Clique em **Send Request** acima de uma requisição.

## Login e token

Nos arquivos que possuem login, a requisição está marcada com `@name login`. Depois de executá-la, o REST Client guarda o resultado e as chamadas seguintes usam automaticamente o accessToken como parâmetro de teste local:

```http
?accessToken={{login.response.body.$.accessToken}}
```

Esse formato por query string existe apenas para facilitar os exemplos do REST Client. No aplicativo, o token continua sendo enviado no cabeçalho de autenticação.

Não publique esse token em screenshots, commits ou mensagens. O usuário de demonstração é `maria.silva@email.com` com senha `senha123`.

## Ordem recomendada

1. `00-health.http`: confirma que a API e o banco estão disponíveis.
2. `01-auth.http`: executa cadastro ou login.
3. `02-users.http` até `11-assistant.http`: testa os recursos por assunto.

Cada bloco iniciado por `###` é uma requisição independente. Os comentários explicam o corpo esperado e os arquivos reutilizam IDs retornados por chamadas anteriores quando necessário.

## Erros comuns

- **404**: confira se está usando `http://localhost:3333`, não a porta do Adminer.
- **401**: execute o login no mesmo arquivo antes das chamadas protegidas. Trocar a senha ou fazer logout revoga todas as sessões; faça login de novo depois.
- **400 "data passada" ou lista de horários vazia**: use uma data futura. Os exemplos de agendamento usam a variável `@bookingDate` (hoje + 7 dias).
- **Falha no banco**: verifique `docker compose logs backend` e aguarde o healthcheck do MySQL.
- **Mudança não aparece**: reinicie o container com `docker compose up --build`.
