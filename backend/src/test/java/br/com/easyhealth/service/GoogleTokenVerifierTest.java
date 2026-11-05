package br.com.easyhealth.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class GoogleTokenVerifierTest {
    @Test
    void refusesToVerifyTokensUntilGoogleClientIdsAreConfigured() {
        GoogleTokenVerifier verifier = new GoogleTokenVerifier(new ObjectMapper(), "");

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> verifier.verify("id-token"));

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, error.getStatusCode());
    }
}
