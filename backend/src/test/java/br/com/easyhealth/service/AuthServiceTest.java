package br.com.easyhealth.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import br.com.easyhealth.dto.LoginRequest;
import br.com.easyhealth.model.User;
import br.com.easyhealth.repository.TokenRepository;
import br.com.easyhealth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private UserRepository users;
    @Mock
    private TokenRepository tokens;
    @Mock
    private JdbcTemplate jdbc;

    private AuthService auth;
    private User user;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        auth = new AuthService(users, tokens, jdbc, passwordEncoder, 15, 7, false);
        user = new User("user-id", "Maria Silva", "maria@example.com",
                passwordEncoder.encode("senha-segura"), null, null, null, null, null, null,
                null, false, null, null, null);
    }

    @Test
    void loginReturnsUserAndPersistsHashedAccessAndRefreshTokens() {
        when(users.findByEmail("maria@example.com")).thenReturn(Optional.of(user));

        Map<String, Object> response = auth.login(
                new LoginRequest("maria@example.com", "senha-segura"));

        assertEquals("user-id", ((Map<?, ?>) response.get("usuario")).get("id"));
        assertEquals(response.get("usuario"), response.get("user"));
        assertFalse(((Map<?, ?>) response.get("user")).containsKey("senhaHash"));
        assertEquals(4, response.size());
        org.junit.jupiter.api.Assertions.assertNotNull(response.get("accessToken"));
        org.junit.jupiter.api.Assertions.assertNotNull(response.get("refreshToken"));
        verify(tokens).save(anyString(), eq("user-id"), eq("access"), org.mockito.ArgumentMatchers.any());
        verify(tokens).save(anyString(), eq("user-id"), eq("refresh"), org.mockito.ArgumentMatchers.any());
    }

    @Test
    void loginRejectsIncorrectPassword() {
        when(users.findByEmail("maria@example.com")).thenReturn(Optional.of(user));

        assertThrows(ResponseStatusException.class,
                () -> auth.login(new LoginRequest("maria@example.com", "senha-incorreta")));
        verify(tokens, never()).save(anyString(), anyString(), anyString(), org.mockito.ArgumentMatchers.any());
    }
}
