package br.com.easyhealth.controller;

import java.util.Map;

import br.com.easyhealth.dto.ForgotPasswordRequest;
import br.com.easyhealth.dto.LoginRequest;
import br.com.easyhealth.dto.RefreshTokenRequest;
import br.com.easyhealth.dto.RegisterRequest;
import br.com.easyhealth.dto.ResetPasswordRequest;
import br.com.easyhealth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(auth.register(request));
    }

    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest request) {
        return auth.login(request);
    }

    @PostMapping("/refresh-token")
    public Map<String, Object> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return auth.refresh(request.refreshToken());
    }

    @PostMapping("/logout")
    public Map<String, String> logout(HttpServletRequest request) {
        auth.logout(request);
        return Map.of("message", "Sessão encerrada.");
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        auth.requestPasswordReset(request.email());
        return Map.of("message", "Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.");
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        auth.resetPassword(request.codigo(), request.novaSenha());
        return Map.of("message", "Senha atualizada. Entre novamente com a nova senha.");
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("message", "A verificação por e-mail exige um serviço de envio configurado."));
    }
}
