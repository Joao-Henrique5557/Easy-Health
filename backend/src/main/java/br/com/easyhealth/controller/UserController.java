package br.com.easyhealth.controller;

import java.util.Map;
import java.util.Optional;

import br.com.easyhealth.dto.ChangePasswordRequest;
import br.com.easyhealth.model.User;
import br.com.easyhealth.repository.UserRepository;
import br.com.easyhealth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users/me")
public class UserController {
    private final AuthService auth;
    private final UserRepository users;
    private final JdbcTemplate jdbc;

    public UserController(AuthService auth, UserRepository users, JdbcTemplate jdbc) {
        this.auth = auth;
        this.users = users;
        this.jdbc = jdbc;
    }

    @GetMapping
    public Map<String, Object> me(HttpServletRequest request) {
        return currentUser(request).publicView();
    }

    @PutMapping
    public Map<String, Object> update(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        User user = currentUser(request);
        users.updateProfile(
                user.id(),
                value(body, "nome", user.nome()),
                value(body, "telefone", user.telefone()),
                value(body, "dataNascimento", user.dataNascimento()),
                value(body, "avatarUrl", user.avatarUrl()),
                value(body, "tipoSanguineo", user.tipoSanguineo()),
                value(body, "alergias", user.alergias()),
                value(body, "medicamentosEmUso", user.medicamentosEmUso()),
                value(body, "planoDeSaude", user.planoDeSaude()),
                value(body, "contatoEmergenciaNome", user.contatoEmergenciaNome()),
                value(body, "contatoEmergenciaTelefone", user.contatoEmergenciaTelefone()),
                value(body, "contatoEmergenciaParentesco", user.contatoEmergenciaParentesco()));
        return currentUser(request).publicView();
    }

    @PatchMapping("/avatar")
    public Map<String, Object> updateAvatar(HttpServletRequest request,
            @RequestBody Map<String, Object> body) {
        User user = currentUser(request);
        users.updateProfile(user.id(), user.nome(), user.telefone(), user.dataNascimento(),
                value(body, "avatarUrl", user.avatarUrl()), user.tipoSanguineo(), user.alergias(),
                user.medicamentosEmUso(), user.planoDeSaude(), user.contatoEmergenciaNome(),
                user.contatoEmergenciaTelefone(), user.contatoEmergenciaParentesco());
        return currentUser(request).publicView();
    }

    @PutMapping("/password")
    public Map<String, String> changePassword(HttpServletRequest request,
            @Valid @RequestBody ChangePasswordRequest body) {
        auth.changePassword(auth.requireUserId(request), body.senhaAtual(), body.novaSenha());
        return Map.of("message", "Senha atualizada. Entre novamente.");
    }

    @PostMapping("/push-token")
    public Map<String, String> savePushToken(HttpServletRequest request,
            @RequestBody Map<String, Object> body) {
        Object token = body.get("token");
        if (!(token instanceof String value) || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um token de notificação válido.");
        }
        jdbc.update("UPDATE users SET push_token = ? WHERE id = ?",
                value.trim(), auth.requireUserId(request));
        return Map.of("message", "Token de notificação registrado.");
    }

    @GetMapping("/preferencias")
    public Map<String, Object> preferences(HttpServletRequest request) {
        currentUser(request);
        return Map.of("notificacoesPush", true, "idioma", "pt-BR");
    }

    @DeleteMapping
    public void delete(HttpServletRequest request) {
        users.delete(auth.requireUserId(request));
    }

    private User currentUser(HttpServletRequest request) {
        String userId = auth.requireUserId(request);
        return users.findById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
    }

    private static String value(Map<String, Object> body, String key, String fallback) {
        if (!body.containsKey(key)) {
            return fallback;
        }
        Object value = body.get(key);
        return value == null ? null : value.toString().trim();
    }
}
