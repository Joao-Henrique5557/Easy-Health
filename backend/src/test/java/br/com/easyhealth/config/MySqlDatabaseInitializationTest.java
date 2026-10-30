package br.com.easyhealth.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

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
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.core.io.ClassPathResource;
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
        if (externalUrl != null && !externalUrl.isBlank()) {
            dataSource = new DriverManagerDataSource(Objects.requireNonNull(externalUrl),
                    Objects.requireNonNullElse(System.getenv("MYSQL_TEST_DB_USER"), ""),
                    Objects.requireNonNullElse(System.getenv("MYSQL_TEST_DB_PASSWORD"), ""));
        } else {
            mysql = new MySQLContainer<>("mysql:8.4");
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
        }

        boolean schemaInitialized = false;
        try {
            JdbcTemplate jdbc = new JdbcTemplate(Objects.requireNonNull(dataSource));
            ResourceDatabasePopulator schema = new ResourceDatabasePopulator(
                    new ClassPathResource("schema.sql"));
            schema.execute(Objects.requireNonNull(dataSource));
            schema.execute(Objects.requireNonNull(dataSource));
            schemaInitialized = true;

            DatabaseInitializer initializer = new DatabaseInitializer(Objects.requireNonNull(dataSource));
            initializer.run(new DefaultApplicationArguments(new String[0]));
            assertEquals(1, jdbc.queryForObject(
                    "SELECT count(*) FROM users WHERE email = 'maria.silva@email.com'", Integer.class));
            assertEquals(3, jdbc.queryForObject("SELECT count(*) FROM establishments", Integer.class));
            assertEquals(4, jdbc.queryForObject("SELECT count(*) FROM first_aid_guides", Integer.class));
            String specialties = Objects.requireNonNull(jdbc.queryForObject(
                    "SELECT especialidades FROM establishments WHERE id = 'hosp-sao-lucas'", String.class));
            assertTrue(specialties.contains("Cardiologia"));

            jdbc.update("""
                    INSERT INTO users (id, nome, email, senha_hash)
                    VALUES ('test-user', 'Usuário de Teste', 'mysql-test@example.com', 'senha-original')
                    """);
            jdbc.update("""
                    INSERT INTO establishments (
                        id, nome, tipo, endereco, latitude, longitude, especialidades, convenios
                    ) VALUES (
                        'test-establishment', 'Estabelecimento de Teste', 'clinica', 'Endereço de Teste',
                        -23.5, -46.6, JSON_ARRAY(), JSON_ARRAY()
                    )
                    """);
            LocalDate bookingDate = LocalDate.now(ZoneId.of("America/Sao_Paulo")).plusDays(1);
            assertTrue(AppointmentAvailability.forDate(jdbc, "test-establishment", bookingDate)
                    .contains("09:30"));
            jdbc.update("""
                    INSERT INTO appointments
                        (id, user_id, establishment_id, especialidade, data, horario)
                    VALUES ('test-appointment', 'test-user', 'test-establishment', 'Teste', ?, '09:30:00')
                    """, java.sql.Date.valueOf(bookingDate));
            assertFalse(AppointmentAvailability.forDate(jdbc, "test-establishment", bookingDate)
                    .contains("09:30"));
            jdbc.update("UPDATE appointments SET status = 'cancelado' WHERE id = 'test-appointment'");
            assertTrue(AppointmentAvailability.forDate(jdbc, "test-establishment", bookingDate)
                    .contains("09:30"));

            CatalogController catalog = new CatalogController(jdbc, new ObjectMapper());
            Map<String, Object> guide = catalog.guide("engasgo");
            assertTrue(((List<?>) guide.get("passos")).contains(
                    "Siga as orientações do atendente e procure atendimento de emergência."));
            Map<String, Object> establishment = catalog.establishment("hosp-sao-lucas");
            assertEquals("privado", establishment.get("redeAtendimento"));
            assertEquals(320, establishment.get("avaliacoesCount"));
            assertEquals(List.of("Cardiologia", "Clínica médica", "Pediatria"),
                    establishment.get("especialidades"));

            jdbc.update("""
                    INSERT INTO favorites (user_id, establishment_id) VALUES (?, ?)
                    AS incoming
                    ON DUPLICATE KEY UPDATE establishment_id = incoming.establishment_id
                    """, "test-user", "test-establishment");
            jdbc.update("""
                    INSERT INTO favorites (user_id, establishment_id) VALUES (?, ?)
                    AS incoming
                    ON DUPLICATE KEY UPDATE establishment_id = incoming.establishment_id
                    """, "test-user", "test-establishment");
            assertEquals(1, jdbc.queryForObject("SELECT count(*) FROM favorites", Integer.class));

            jdbc.update("UPDATE users SET senha_hash = 'senha-alterada' WHERE id = 'test-user'");
            jdbc.update("UPDATE establishments SET nome = 'Nome atualizado' WHERE id = 'test-establishment'");
            initializer.run(new DefaultApplicationArguments(new String[0]));

            assertEquals("senha-alterada", jdbc.queryForObject(
                    "SELECT senha_hash FROM users WHERE id = 'test-user'", String.class));
            assertEquals("Nome atualizado", jdbc.queryForObject(
                    "SELECT nome FROM establishments WHERE id = 'test-establishment'", String.class));
            assertEquals(4, jdbc.queryForObject("SELECT count(*) FROM establishments", Integer.class));
            assertEquals(4, jdbc.queryForObject("SELECT count(*) FROM first_aid_guides", Integer.class));
            assertEquals("maria.silva@email.com", jdbc.queryForObject(
                    "SELECT email FROM users WHERE id = 'demo-user'", String.class));
            jdbc.update("DELETE FROM users WHERE id = 'test-user'");
            jdbc.update("DELETE FROM establishments WHERE id = 'test-establishment'");
            assertEquals(3, jdbc.queryForObject("SELECT count(*) FROM establishments", Integer.class));
        } finally {
            if (schemaInitialized) {
                JdbcTemplate jdbc = new JdbcTemplate(dataSource);
                jdbc.update("DELETE FROM users WHERE id = 'test-user'");
                jdbc.update("DELETE FROM establishments WHERE id = 'test-establishment'");
            }
            if (mysql != null) {
                mysql.stop();
            }
        }
    }
}
