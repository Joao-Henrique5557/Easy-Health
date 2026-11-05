package br.com.easyhealth.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.nio.file.Path;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import javax.sql.DataSource;

import br.com.easyhealth.controller.CatalogController;
import br.com.easyhealth.service.AppointmentAvailability;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.lang.NonNull;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.testcontainers.containers.MySQLContainer;

class MySqlDatabaseInitializationTest {
    @Test
    void initializesMySqlSchemaAndSeedsWithoutOverwritingExistingData() {
        String externalUrl = System.getenv("MYSQL_TEST_DB_URL");
        MySQLContainer<?> mysql = null;
        DataSource dataSource;
        DataSource initializationDataSource;
        if (externalUrl != null && !externalUrl.isBlank()) {
            dataSource = new DriverManagerDataSource(Objects.requireNonNull(externalUrl),
                    environmentOrDefault("MYSQL_TEST_DB_USER", ""),
                    environmentOrDefault("MYSQL_TEST_DB_PASSWORD", ""));
            initializationDataSource = dataSource;
        } else {
            mysql = new MySQLContainer<>("mysql:8.4")
                    .withDatabaseName("easyhealth")
                    .withUsername("easyhealth")
                    .withPassword("easyhealth");
            try {
                mysql.start();
            } catch (RuntimeException exception) {
                assumeTrue(false, "Docker is unavailable for the isolated MySQL integration test.");
                return;
            }
            dataSource = new DriverManagerDataSource(
                    Objects.requireNonNull(mysql.getJdbcUrl()),
                    Objects.requireNonNull(mysql.getUsername()),
                    Objects.requireNonNull(mysql.getPassword()));
            initializationDataSource = new DriverManagerDataSource(
                    Objects.requireNonNull(mysql.getJdbcUrl()), "root",
                    Objects.requireNonNull(mysql.getPassword()));
        }

        boolean schemaInitialized = false;
        try {
            JdbcTemplate jdbc = new JdbcTemplate(Objects.requireNonNull(dataSource));
            ResourceDatabasePopulator appSchema = new ResourceDatabasePopulator(
                    new FileSystemResource(Objects.requireNonNull(
                            Path.of("..", "docs", "SQL", "01_easyhealth.sql")
                                    .toAbsolutePath().normalize())));
            ResourceDatabasePopulator catalogSchema = new ResourceDatabasePopulator(
                    new FileSystemResource(Objects.requireNonNull(
                            Path.of("..", "docs", "SQL", "02_instituicoes_medicas.sql")
                                    .toAbsolutePath().normalize())));
            ResourceDatabasePopulator catalogExamples = new ResourceDatabasePopulator(
                    new FileSystemResource(Objects.requireNonNull(
                            Path.of("..", "docs", "SQL", "03_dados_exemplo_instituicoes.sql")
                                    .toAbsolutePath().normalize())));
            ResourceDatabasePopulator userExamples = new ResourceDatabasePopulator(
                    new FileSystemResource(Objects.requireNonNull(
                            Path.of("..", "docs", "SQL", "04_dados_exemplo_usuario.sql")
                                    .toAbsolutePath().normalize())));
            appSchema.execute(Objects.requireNonNull(initializationDataSource));
            catalogSchema.execute(Objects.requireNonNull(initializationDataSource));
            catalogExamples.execute(Objects.requireNonNull(initializationDataSource));
            catalogExamples.execute(Objects.requireNonNull(initializationDataSource));
            userExamples.execute(Objects.requireNonNull(initializationDataSource));
            appSchema.execute(Objects.requireNonNull(initializationDataSource));
            schemaInitialized = true;

            assertEquals(1, jdbc.queryForObject(
                    "SELECT count(*) FROM users WHERE email = 'maria.silva@email.com'", Integer.class));
            assertEquals(0, jdbc.queryForObject("SELECT count(*) FROM oauth_identities", Integer.class));
            assertEquals(0, jdbc.queryForObject("SELECT count(*) FROM medical_history_records", Integer.class));
            assertEquals(26, jdbc.queryForObject(
                    "SELECT count(*) FROM easyhealth_institutions.instituicoes_saude", Integer.class));
            assertEquals(62, jdbc.queryForObject(
                    "SELECT count(*) FROM easyhealth_institutions.instituicao_especialidades", Integer.class));
            assertEquals(0, jdbc.queryForObject(
                    "SELECT count(*) FROM information_schema.tables "
                            + "WHERE table_schema = DATABASE() AND table_name IN "
                            + "('establishments', 'first_aid_guides')", Integer.class));

            jdbc.update("""
                    INSERT INTO users (id, nome, email, senha_hash)
                    VALUES ('test-user', 'Usuário de Teste', 'mysql-test@example.com', 'senha-original')
                    """);
            String establishmentId = "parceiro-hospital-exemplo";
            LocalDate bookingDate = LocalDate.now(ZoneId.of("America/Sao_Paulo")).plusDays(1);
            assertTrue(AppointmentAvailability.forDate(jdbc, establishmentId, bookingDate)
                    .contains("09:30"));
            jdbc.update("""
                    INSERT INTO appointments
                        (id, user_id, establishment_id, especialidade, data, horario)
                    VALUES ('test-appointment', 'test-user', ?, 'Teste', ?, '09:30:00')
                    """, establishmentId, java.sql.Date.valueOf(bookingDate));
            assertFalse(AppointmentAvailability.forDate(jdbc, establishmentId, bookingDate)
                    .contains("09:30"));
            jdbc.update("UPDATE appointments SET status = 'cancelado' WHERE id = 'test-appointment'");
            assertTrue(AppointmentAvailability.forDate(jdbc, establishmentId, bookingDate)
                    .contains("09:30"));

            CatalogController catalog = new CatalogController(jdbc, new ObjectMapper());
            Map<String, Object> establishment = catalog.establishment(establishmentId);
            assertEquals("privado", establishment.get("redeAtendimento"));
            assertEquals(120, establishment.get("avaliacoesCount"));
            assertTrue(((List<?>) establishment.get("especialidades")).contains("Cardiologia"));
            assertTrue(catalog.establishmentSpecialties(establishmentId).contains("Cardiologia"));
            assertTrue(catalog.specialties().contains("Cardiologia"));

            jdbc.update("""
                    INSERT INTO favorites (user_id, establishment_id) VALUES (?, ?)
                    AS incoming
                    ON DUPLICATE KEY UPDATE establishment_id = incoming.establishment_id
                    """, "test-user", establishmentId);
            jdbc.update("""
                    INSERT INTO favorites (user_id, establishment_id) VALUES (?, ?)
                    AS incoming
                    ON DUPLICATE KEY UPDATE establishment_id = incoming.establishment_id
                    """, "test-user", establishmentId);
            assertEquals(1, jdbc.queryForObject("SELECT count(*) FROM favorites", Integer.class));

            jdbc.update("UPDATE users SET senha_hash = 'senha-alterada' WHERE id = 'test-user'");
            appSchema.execute(Objects.requireNonNull(initializationDataSource));

            assertEquals("senha-alterada", jdbc.queryForObject(
                    "SELECT senha_hash FROM users WHERE id = 'test-user'", String.class));
            assertEquals(26, jdbc.queryForObject(
                    "SELECT count(*) FROM easyhealth_institutions.instituicoes_saude", Integer.class));
            assertEquals("maria.silva@email.com", jdbc.queryForObject(
                    "SELECT email FROM users WHERE id = 'demo-user'", String.class));
            jdbc.update("DELETE FROM users WHERE id = 'test-user'");
        } finally {
            if (schemaInitialized) {
                JdbcTemplate jdbc = new JdbcTemplate(dataSource);
                jdbc.update("DELETE FROM users WHERE id = 'test-user'");
                jdbc.update("DELETE FROM appointments WHERE id = 'test-appointment'");
            }
            if (mysql != null) {
                mysql.close();
            }
        }
    }

    @NonNull
    private static String environmentOrDefault(@NonNull String name, @NonNull String fallback) {
        String value = System.getenv(name);
        return value == null ? fallback : value;
    }
}
