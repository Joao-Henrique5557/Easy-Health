package br.com.easyhealth.repository;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class TokenRepository {
    private final JdbcTemplate jdbc;

    public TokenRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void save(String hash, String userId, String type, Instant expiresAt) {
        jdbc.update("""
                INSERT INTO auth_tokens (token_hash, user_id, token_type, expires_at)
                VALUES (?, ?, ?, ?)
                """, hash, userId, type, Timestamp.from(expiresAt));
    }

    public Optional<String> findActiveUser(String hash, String type) {
        return jdbc.query("""
                SELECT user_id FROM auth_tokens
                WHERE token_hash = ? AND token_type = ? AND revoked = false AND expires_at > now()
                """, (row, index) -> row.getString("user_id"), hash, type).stream().findFirst();
    }

    public void revoke(String hash) {
        jdbc.update("UPDATE auth_tokens SET revoked = true WHERE token_hash = ?", hash);
    }

    public void revokeAll(String userId) {
        jdbc.update("UPDATE auth_tokens SET revoked = true WHERE user_id = ?", userId);
    }
}
