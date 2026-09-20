# Easy Health — backend Java

Backend didático Java 17/Maven WAR, com Jakarta Servlet (Tomcat 10), Gson e PostgreSQL JDBC. O MVC é organizado em `model`, `dao`, `controller` e `util`; os DAOs usam sempre `PreparedStatement`.

## Execução local
1. Crie o banco PostgreSQL `easyhealth` e configure `DB_URL`, `DB_USER` e `DB_PASSWORD` (variáveis de ambiente).
2. Execute `psql "$DB_URL" -f src/main/resources/schema.sql` e, opcionalmente, `seed.sql`. Ao iniciar o WAR, `DatabaseInitializer` executa automaticamente os dois arquivos (schema e seed); confira em `GET http://localhost:3333/health` e procure o Hospital São Lucas em `/api/estabelecimentos/busca`.
3. Rode `mvn test package` e copie `target/easy-health.war` para `TOMCAT_HOME/webapps`.

`docker compose up --build` sobe PostgreSQL e Tomcat automaticamente. A aplicação fica em `http://localhost:3333` (Tomcat interno usa 8080); o Adminer fica em `http://localhost:8080`.

As rotas de health, autenticação, perfil, primeiros socorros, estabelecimentos, emergência, favoritos e notificações estão disponíveis. Agendamentos, histórico, localização e assistant possuem respostas compatíveis mínimas/mockadas para o frontend; integrações externas (Nominatim, IA e agenda médica) não são realizadas neste MVP. Expanda os DAOs e tabelas antes de produção.
