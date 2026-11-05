package br.com.easyhealth.service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GoogleTokenVerifier {
    private final ObjectMapper mapper;
    private final Set<String> allowedAudiences;
    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    public GoogleTokenVerifier(ObjectMapper mapper,
            @Value("${app.google.client-ids:}") String configuredClientIds) {
        this.mapper = mapper;
        this.allowedAudiences = Arrays.stream(configuredClientIds.split(","))
                .map((@NonNull String clientId) -> clientId.trim())
                .filter(value -> !value.isEmpty())
                .collect(Collectors.toUnmodifiableSet());
    }

    public GoogleIdentity verify(String idToken) {
        if (allowedAudiences.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Login Google ainda não foi configurado neste ambiente.");
        }
        try {
            String encodedToken = URLEncoder.encode(idToken, StandardCharsets.UTF_8);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodedToken))
                    .timeout(Duration.ofSeconds(8))
                    .GET()
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw invalidToken();
            }
            JsonNode claims = mapper.readTree(response.body());
            String issuer = text(claims, "iss");
            String audience = text(claims, "aud");
            String subject = text(claims, "sub");
            String email = text(claims, "email");
            String name = text(claims, "name");
            boolean emailVerified = claims.path("email_verified").asBoolean(false)
                    || "true".equalsIgnoreCase(text(claims, "email_verified"));
            if (!("accounts.google.com".equals(issuer) || "https://accounts.google.com".equals(issuer))
                    || !allowedAudiences.contains(audience)
                    || subject.isBlank() || email.isBlank() || !emailVerified) {
                throw invalidToken();
            }
            if (name.isBlank()) {
                name = email.substring(0, email.indexOf('@'));
            }
            return new GoogleIdentity(subject, email, name);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Não foi possível verificar a conta Google. Tente novamente.", exception);
        } catch (IOException | IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Não foi possível verificar a conta Google. Tente novamente.", exception);
        }
    }

    private static String text(JsonNode claims, String field) {
        JsonNode value = claims.get(field);
        return value == null || value.isNull() ? "" : value.asText();
    }

    private static ResponseStatusException invalidToken() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google inválido ou expirado.");
    }

    public record GoogleIdentity(String subject, String email, String name) {
    }
}
