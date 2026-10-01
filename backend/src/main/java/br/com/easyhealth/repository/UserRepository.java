package br.com.easyhealth.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import br.com.easyhealth.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    private static final String USER_COLUMNS = """
            id, nome, email, senha_hash, telefone, data_nascimento,
            avatar_url, tipo_sanguineo, alergias, medicamentos_em_uso,
            plano_de_saude, email_verificado, contato_emergencia_nome,
            contato_emergencia_telefone, contato_emergencia_parentesco
            """;

    private static final RowMapper<User> USER_MAPPER = UserRepository::mapUser;
    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Optional<User> findById(String id) {
        return jdbc.query("SELECT " + USER_COLUMNS + " FROM users WHERE id = ?", USER_MAPPER, id)
                .stream().findFirst();
    }

    public Optional<User> findByEmail(String email) {
        return jdbc.query("SELECT " + USER_COLUMNS + " FROM users WHERE lower(email) = lower(?)",
                USER_MAPPER, email).stream().findFirst();
    }

    public User create(String nome, String email, String passwordHash, String telefone, String dataNascimento) {
        String id = UUID.randomUUID().toString();
        jdbc.update("""
                INSERT INTO users (id, nome, email, senha_hash, telefone, data_nascimento)
                VALUES (?, ?, lower(?), ?, ?, ?)
                """, id, nome.trim(), email.trim(), passwordHash, emptyToNull(telefone),
                toDate(dataNascimento));
        return findById(id).orElseThrow();
    }

    public void updateProfile(String id, String nome, String telefone, String dataNascimento,
            String avatarUrl, String tipoSanguineo, String alergias, String medicamentos,
            String plano, String contatoNome, String contatoTelefone, String contatoParentesco) {
        jdbc.update("""
                UPDATE users SET nome = ?, telefone = ?, data_nascimento = ?, avatar_url = ?,
                    tipo_sanguineo = ?, alergias = ?, medicamentos_em_uso = ?, plano_de_saude = ?,
                    contato_emergencia_nome = ?, contato_emergencia_telefone = ?,
                    contato_emergencia_parentesco = ?
                WHERE id = ?
                """, nome, emptyToNull(telefone), toDate(dataNascimento), emptyToNull(avatarUrl),
                emptyToNull(tipoSanguineo), emptyToNull(alergias), emptyToNull(medicamentos),
                emptyToNull(plano), emptyToNull(contatoNome), emptyToNull(contatoTelefone),
                emptyToNull(contatoParentesco), id);
    }

    public void updatePassword(String id, String passwordHash) {
        jdbc.update("UPDATE users SET senha_hash = ? WHERE id = ?", passwordHash, id);
    }

    public void updatePushToken(String id, String token) {
        jdbc.update("UPDATE users SET push_token = ? WHERE id = ?", emptyToNull(token), id);
    }

    public void verifyEmail(String email) {
        jdbc.update("UPDATE users SET email_verificado = true WHERE lower(email) = lower(?)", email);
    }

    public void delete(String id) {
        jdbc.update("DELETE FROM users WHERE id = ?", id);
    }

    private static User mapUser(ResultSet row, int index) throws SQLException {
        java.sql.Date birthDate = row.getDate("data_nascimento");
        return new User(
                row.getString("id"),
                row.getString("nome"),
                row.getString("email"),
                row.getString("senha_hash"),
                row.getString("telefone"),
                birthDate == null ? null : birthDate.toString(),
                row.getString("avatar_url"),
                row.getString("tipo_sanguineo"),
                row.getString("alergias"),
                row.getString("medicamentos_em_uso"),
                row.getString("plano_de_saude"),
                row.getBoolean("email_verificado"),
                row.getString("contato_emergencia_nome"),
                row.getString("contato_emergencia_telefone"),
                row.getString("contato_emergencia_parentesco"));
    }

    private static String emptyToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private static java.sql.Date toDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return java.sql.Date.valueOf(LocalDate.parse(value.trim()));
        } catch (java.time.format.DateTimeParseException exception) {
            throw new IllegalArgumentException("Data de nascimento inválida. Use o formato AAAA-MM-DD.");
        }
    }
}
