package br.com.easyhealth.controller;

import java.sql.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import br.com.easyhealth.dto.MedicalHistoryRecordRequest;
import br.com.easyhealth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class MedicalHistoryController {
    private static final List<String> RECORD_TYPES = List.of("exame", "vacina", "medicamento", "documento");

    private final JdbcTemplate jdbc;
    private final AuthService auth;

    public MedicalHistoryController(JdbcTemplate jdbc, AuthService auth) {
        this.jdbc = jdbc;
        this.auth = auth;
    }

    @GetMapping("/api/historico/registros")
    public List<Map<String, Object>> records(HttpServletRequest request,
            @RequestParam(required = false) String tipo) {
        String userId = auth.requireUserId(request);
        if (tipo != null && !RECORD_TYPES.contains(tipo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de registro inválido.");
        }
        String sql = """
                SELECT id, tipo, titulo, data, descricao, profissional, local
                FROM medical_history_records WHERE user_id = ?
                """ + (tipo == null ? "" : " AND tipo = ?") + " ORDER BY data DESC, created_at DESC";
        return tipo == null
                ? jdbc.query(sql, this::mapRecord, userId)
                : jdbc.query(sql, this::mapRecord, userId, tipo);
    }

    @PostMapping("/api/historico/registros")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createRecord(HttpServletRequest request,
            @Valid @RequestBody MedicalHistoryRecordRequest body) {
        String id = UUID.randomUUID().toString();
        String userId = auth.requireUserId(request);
        jdbc.update("""
                INSERT INTO medical_history_records
                    (id, user_id, tipo, titulo, data, descricao, profissional, local)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, id, userId, body.tipo(), body.titulo().trim(), Date.valueOf(body.data()),
                emptyToNull(body.descricao()), emptyToNull(body.profissional()), emptyToNull(body.local()));
        return findRecord(id, userId);
    }

    @PutMapping("/api/historico/registros/{id}")
    public Map<String, Object> updateRecord(HttpServletRequest request, @PathVariable String id,
            @Valid @RequestBody MedicalHistoryRecordRequest body) {
        String userId = auth.requireUserId(request);
        findRecord(id, userId);
        jdbc.update("""
                UPDATE medical_history_records
                SET tipo = ?, titulo = ?, data = ?, descricao = ?, profissional = ?, local = ?
                WHERE id = ? AND user_id = ?
                """, body.tipo(), body.titulo().trim(), Date.valueOf(body.data()),
                emptyToNull(body.descricao()), emptyToNull(body.profissional()), emptyToNull(body.local()),
                id, userId);
        return findRecord(id, userId);
    }

    @DeleteMapping("/api/historico/registros/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecord(HttpServletRequest request, @PathVariable String id) {
        String userId = auth.requireUserId(request);
        findRecord(id, userId);
        jdbc.update("DELETE FROM medical_history_records WHERE id = ? AND user_id = ?", id, userId);
    }

    private Map<String, Object> findRecord(String id, String userId) {
        return jdbc.query("""
                SELECT id, tipo, titulo, data, descricao, profissional, local
                FROM medical_history_records WHERE id = ? AND user_id = ?
                """, this::mapRecord, id, userId).stream().findFirst().orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro do histórico não encontrado."));
    }

    private Map<String, Object> mapRecord(java.sql.ResultSet row, int index) throws java.sql.SQLException {
        Map<String, Object> record = new LinkedHashMap<>();
        record.put("id", row.getString("id"));
        record.put("tipo", row.getString("tipo"));
        record.put("titulo", row.getString("titulo"));
        record.put("data", row.getDate("data").toLocalDate().toString());
        record.put("descricao", row.getString("descricao"));
        record.put("profissional", row.getString("profissional"));
        record.put("local", row.getString("local"));
        return record;
    }

    private static String emptyToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
