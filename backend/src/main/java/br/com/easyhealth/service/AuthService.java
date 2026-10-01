package br.com.easyhealth.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import br.com.easyhealth.dto.LoginRequest;
import br.com.easyhealth.dto.RegisterRequest;
import br.com.easyhealth.model.User;
import br.com.easyhealth.repository.TokenRepository;
import br.com.easyhealth.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String UNAUTHORIZED = "Autenticação necessária.";

    private final UserRepository users;
    private final TokenRepository tokens;
    private final JdbcTemplate jdbc;
    private final PasswordEncoder passwords;
    private final long accessTokenMinutes;
    private final long refreshTokenDays;
    private final boolean logResetCodes;

    public AuthService(UserRepository users, TokenRepository tokens, JdbcTemplate jdbc,
            PasswordEncoder passwords,
            @Value("${app.access-token-minutes:15}") long accessTokenMinutes,
            @Value("${app.refresh-token-days:7}") long refreshTokenDays,
            @Value("${app.reset-code-log-enabled:false}") boolean logResetCodes) {
        this.users = users;
        this.tokens = tokens;
        this.jdbc = jdbc;
        this.passwords = passwords;
        this.accessTokenMinutes = accessTokenMinutes;
        this.refreshTokenDays = refreshTokenDays;
        this.logResetCodes = logResetCodes;
    }

    @Transactional
    public Map<String, Object> register(RegisterRequest request) {
        if (users.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        }
        User user = users.create(request.nome(), request.email(),
                passwords.encode(request.senha()), request.telefone(), request.dataNascimento());
        return sessionResponse(user);
    }

    @Transactional
    public Map<String, Object> login(LoginRequest request) {
        User user = users.findByEmail(request.email())
                .filter(found -> passwords.matches(request.senha(), found.senhaHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Credenciais inválidas."));
        return sessionResponse(user);
    }

    @Transactional
    public Map<String, Object> refresh(String refreshToken) {
        String hash = hash(refreshToken);
        String userId = tokens.findActiveUser(hash, "refresh")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Refresh token inválido ou expirado."));
        tokens.revoke(hash);
        User user = users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Usuário não encontrado."));
        return sessionResponse(user);
    }

    public Optional<String> userIdFromAccessToken(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return tokens.findActiveUser(hash(token), "access");
    }

    public String requireUserId(HttpServletRequest request) {
        return userIdFromAccessToken(readAccessToken(request))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, UNAUTHORIZED));
    }

    @Transactional
    public void logout(HttpServletRequest request) {
        String token = readAccessToken(request);
        userIdFromAccessToken(token).ifPresent(tokens::revokeAll);
    }

    @Transactional
    public void changePassword(String userId, String currentPassword, String newPassword) {
        User user = users.findById(userId).orElseThrow();
        if (!passwords.matches(currentPassword, user.senhaHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha atual está incorreta.");
        }
        users.updatePassword(userId, passwords.encode(newPassword));
        tokens.revokeAll(userId);
    }

    @Transactional
    public void requestPasswordReset(String email) {
        users.findByEmail(email).ifPresent(user -> {
            String code = String.format("%06d", RANDOM.nextInt(1_000_000));
            jdbc.update("DELETE FROM password_reset_codes WHERE user_id = ?", user.id());
            jdbc.update("""
                    INSERT INTO password_reset_codes (code_hash, user_id, expires_at)
                    VALUES (?, ?, ?)
                    """, hash(code), user.id(),
                    java.sql.Timestamp.from(Instant.now().plus(15, ChronoUnit.MINUTES)));
            if (logResetCodes) {
                logger.info("Código temporário de recuperação para {}: {}", user.email(), code);
            }
        });
    }

    @Transactional
    public void resetPassword(String code, String newPassword) {
        var codes = jdbc.query("""
                SELECT user_id FROM password_reset_codes
                WHERE code_hash = ? AND used = false AND expires_at > now()
                """, (row, index) -> row.getString("user_id"), hash(code));
        if (codes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Código inválido ou expirado.");
        }
        String userId = codes.get(0);
        jdbc.update("UPDATE password_reset_codes SET used = true WHERE code_hash = ?", hash(code));
        users.updatePassword(userId, passwords.encode(newPassword));
        tokens.revokeAll(userId);
    }

    private Map<String, Object> sessionResponse(User user) {
        String accessToken = issueToken(user.id(), "access",
                Instant.now().plus(accessTokenMinutes, ChronoUnit.MINUTES));
        String refreshToken = issueToken(user.id(), "refresh",
                Instant.now().plus(refreshTokenDays, ChronoUnit.DAYS));
        Map<String, Object> userView = user.publicView();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("usuario", userView);
        response.put("user", userView);
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        return response;
    }

    private String issueToken(String userId, String type, Instant expiresAt) {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        tokens.save(hash(token), userId, type, expiresAt);
        return token;
    }

    private static String readAccessToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return authorization.substring(7).trim();
        }
        String headerToken = request.getHeader("X-Access-Token");
        return headerToken == null || headerToken.isBlank()
                ? request.getParameter("accessToken")
                : headerToken.trim();
    }

    private static String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (java.security.NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 indisponível.", exception);
        }
    }
}
