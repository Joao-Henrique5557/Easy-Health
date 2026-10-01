package br.com.easyhealth.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import javax.sql.DataSource;

import org.junit.jupiter.api.Test;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.testcontainers.containers.PostgreSQLContainer;

class LegacySchemaCompatibilityTest {
    @Test
    void migratesLegacyRowsAndAllowsNewWritesWithoutBreakingLegacyConstraints() throws Exception {
        String externalUrl = System.getenv("LEGACY_TEST_DB_URL");
        PostgreSQLContainer<?> postgres = null;
        DataSource dataSource;
        if (externalUrl != null && !externalUrl.isBlank()) {
            dataSource = new DriverManagerDataSource(externalUrl,
                    System.getenv("LEGACY_TEST_DB_USER"), System.getenv("LEGACY_TEST_DB_PASSWORD"));
        } else {
            postgres = new PostgreSQLContainer<>("postgres:16-alpine");
            try {
                postgres.start();
            } catch (RuntimeException exception) {
                assumeTrue(false, "Docker is unavailable for the isolated PostgreSQL regression test.");
                return;
            }
            dataSource = new DriverManagerDataSource(
                    postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
        }
        try {
            verifyLegacyMigration(dataSource);
        } finally {
            if (postgres != null) {
                postgres.stop();
            }
        }
    }

    private static void verifyLegacyMigration(DataSource dataSource) {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);

        createLegacySchema(jdbc);
        new ResourceDatabasePopulator(new ClassPathResource("schema.sql")).execute(dataSource);
        new ResourceDatabasePopulator(new ClassPathResource("schema.sql")).execute(dataSource);

        LegacySchemaCompatibility compatibility = new LegacySchemaCompatibility(jdbc, dataSource);
        compatibility.run(new DefaultApplicationArguments(new String[0]));
        compatibility.run(new DefaultApplicationArguments(new String[0]));

        assertEquals("hash-legado", jdbc.queryForObject(
                "SELECT senha_hash FROM users WHERE id = 'legacy-user'", String.class));
        assertEquals("Alergia preservada", jdbc.queryForObject(
                "SELECT alergias FROM users WHERE id = 'legacy-user'", String.class));
        assertEquals("Hospital São Lucas", jdbc.queryForObject(
                "SELECT e.nome FROM favorites f JOIN establishments e ON e.id = f.establishment_id "
                        + "WHERE f.user_id = 'legacy-user' LIMIT 1", String.class));
        assertEquals(2, jdbc.queryForObject(
                "SELECT count(*) FROM favorites WHERE user_id = 'legacy-user'", Integer.class));
        assertEquals("Ícone legado", jdbc.queryForObject(
                "SELECT icon FROM notifications WHERE id = 'legacy-notification'", String.class));
        assertEquals("Texto preservado", jdbc.queryForObject(
                "SELECT descricao FROM notifications WHERE id = 'legacy-notification'", String.class));

        jdbc.update("""
                INSERT INTO users (id, nome, email, senha_hash, email_verificado)
                VALUES ('new-user', 'Nova Pessoa', 'nova@example.com', 'novo-hash', true)
                """);
        assertEquals("novo-hash", jdbc.queryForObject(
                "SELECT \"senhaHash\" FROM users WHERE id = 'new-user'", String.class));
        assertNotNull(jdbc.queryForObject(
                "SELECT \"createdAt\" FROM users WHERE id = 'new-user'", java.sql.Timestamp.class));

        jdbc.update("""
                INSERT INTO favorites (user_id, establishment_id)
                SELECT 'legacy-user', 'hosp-sao-lucas'
                WHERE NOT EXISTS (
                    SELECT 1 FROM favorites
                    WHERE user_id = 'legacy-user' AND establishment_id = 'hosp-sao-lucas'
                )
                """);
        assertEquals(2, jdbc.queryForObject(
                "SELECT count(*) FROM favorites WHERE user_id = 'legacy-user'", Integer.class));
        jdbc.update("INSERT INTO favorites (user_id, establishment_id) VALUES ('new-user', 'upa-se')");
        assertNotNull(jdbc.queryForObject(
                "SELECT id FROM favorites WHERE user_id = 'new-user'", String.class));
        assertEquals("new-user", jdbc.queryForObject(
                "SELECT \"userId\" FROM favorites WHERE user_id = 'new-user'", String.class));

        jdbc.update("""
                INSERT INTO notifications (id, user_id, titulo, descricao)
                VALUES ('new-notification', 'new-user', 'Nova', 'Notificação')
                """);
        assertEquals("new-user", jdbc.queryForObject(
                "SELECT \"userId\" FROM notifications WHERE id = 'new-notification'", String.class));
        assertEquals("notifications", jdbc.queryForObject(
                "SELECT icon FROM notifications WHERE id = 'new-notification'", String.class));
        assertEquals(4, jdbc.queryForObject(
                "SELECT count(*) FROM first_aid_guides", Integer.class));
    }

    private static void createLegacySchema(JdbcTemplate jdbc) {
        jdbc.execute("""
                CREATE TABLE users (
                    id varchar(36) PRIMARY KEY,
                    nome text NOT NULL,
                    email text UNIQUE NOT NULL,
                    "senhaHash" text NOT NULL,
                    telefone text,
                    "dataNascimento" date,
                    "avatarUrl" text,
                    "tipoSanguineo" text,
                    alergias text,
                    "medicamentosEmUso" text,
                    "planoDeSaude" text,
                    "contatoEmergenciaNome" text,
                    "contatoEmergenciaTelefone" text,
                    "contatoEmergenciaParentesco" text,
                    "emailVerificado" boolean NOT NULL DEFAULT false,
                    "emailVerificationCodeHash" text,
                    "createdAt" timestamptz NOT NULL,
                    "updatedAt" timestamptz NOT NULL
                )
                """);
        jdbc.execute("""
                CREATE TABLE favorites (
                    id varchar(36) PRIMARY KEY NOT NULL,
                    "userId" varchar(36) NOT NULL,
                    "establishmentId" text NOT NULL,
                    "createdAt" timestamptz NOT NULL
                )
                """);
        jdbc.execute("""
                CREATE TABLE notifications (
                    id varchar(36) PRIMARY KEY,
                    "userId" varchar(36) NOT NULL,
                    icon text NOT NULL,
                    titulo text NOT NULL,
                    descricao text NOT NULL,
                    lida boolean NOT NULL DEFAULT false,
                    "createdAt" timestamptz NOT NULL
                )
                """);
        jdbc.execute("""
                CREATE TABLE first_aid_guides (
                    id text PRIMARY KEY,
                    titulo text NOT NULL,
                    resumo text NOT NULL,
                    icon text NOT NULL,
                    passos text[] NOT NULL DEFAULT '{}',
                    ordem integer NOT NULL
                )
                """);
        jdbc.update("""
                INSERT INTO users (
                    id, nome, email, "senhaHash", telefone, "dataNascimento", "avatarUrl",
                    "tipoSanguineo", alergias, "medicamentosEmUso", "planoDeSaude",
                    "contatoEmergenciaNome", "contatoEmergenciaTelefone",
                    "contatoEmergenciaParentesco", "emailVerificado", "createdAt", "updatedAt"
                ) VALUES (
                    'legacy-user', 'Pessoa Legada', 'legado@example.com', 'hash-legado',
                    '11999999999', '1985-05-10', 'avatar-legado', 'O+',
                    'Alergia preservada', 'Medicamento preservado', 'Plano legado',
                    'Contato legado', '11888888888', 'Irmã', true, now(), now()
                )
                """);
        jdbc.update("""
                INSERT INTO favorites (id, "userId", "establishmentId", "createdAt")
                VALUES
                    ('favorite-one', 'legacy-user', 'hosp-sao-lucas', now()),
                    ('favorite-two', 'legacy-user', 'hosp-sao-lucas', now())
                """);
        jdbc.update("""
                INSERT INTO notifications (id, "userId", icon, titulo, descricao, lida, "createdAt")
                VALUES ('legacy-notification', 'legacy-user', 'Ícone legado', 'Título legado',
                        'Texto preservado', true, now())
                """);
    }
}
