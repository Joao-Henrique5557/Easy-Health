package br.com.easyhealth.controller;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import br.com.easyhealth.service.AuthService;
import br.com.easyhealth.service.AppointmentAvailability;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class PersonalDataController {
    private final JdbcTemplate jdbc;
    private final AuthService auth;

    public PersonalDataController(JdbcTemplate jdbc, AuthService auth) {
        this.jdbc = jdbc;
        this.auth = auth;
    }

    @GetMapping("/api/agendamentos")
    public List<Map<String, Object>> bookings(HttpServletRequest request) {
        String userId = auth.requireUserId(request);
        LocalDate today = LocalDate.now(java.time.ZoneId.of("America/Sao_Paulo"));
        LocalTime now = LocalTime.now(java.time.ZoneId.of("America/Sao_Paulo"));
        return jdbc.query("""
                SELECT a.id, a.user_id, a.establishment_id, e.nome AS establishment_name,
                    a.especialidade, a.data, a.horario, a.status
                FROM appointments a JOIN establishments e ON e.id = a.establishment_id
                WHERE a.user_id = ? AND a.status IN ('agendado', 'confirmado')
                    AND (a.data > ? OR (a.data = ? AND a.horario >= ?))
                ORDER BY a.data, a.horario
                """, (row, index) -> bookingView(
                        row.getString("id"), row.getString("user_id"), row.getString("establishment_id"),
                        row.getString("establishment_name"), row.getString("especialidade"),
                        row.getDate("data"), row.getTime("horario"), row.getString("status")),
                userId, Date.valueOf(today), Date.valueOf(today), Time.valueOf(now.withNano(0)));
    }

    @PostMapping("/api/agendamentos")
    @Transactional
    public Map<String, Object> createBooking(HttpServletRequest request,
            @RequestBody Map<String, Object> body) {
        String userId = auth.requireUserId(request);
        String establishmentId = required(body, "establishmentId");
        String specialty = required(body, "especialidade");
        LocalDate date = parseDate(required(body, "data"));
        LocalTime time = parseTime(required(body, "horario"));
        LocalDate today = LocalDate.now(java.time.ZoneId.of("America/Sao_Paulo"));
        if (date.isBefore(today)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível agendar em uma data passada.");
        }
        String slot = time.format(DateTimeFormatter.ofPattern("HH:mm"));
        if (time.getSecond() != 0 || time.getNano() != 0 || !AppointmentAvailability.isSlot(slot)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Horário indisponível.");
        }
        try {
            jdbc.queryForObject("SELECT id FROM establishments WHERE id = ? FOR UPDATE", String.class,
                    establishmentId);
        } catch (org.springframework.dao.EmptyResultDataAccessException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Estabelecimento não encontrado ou agendamento inválido.");
        }
        if (!AppointmentAvailability.forDate(jdbc, establishmentId, date, true).contains(slot)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este horário não está mais disponível. Escolha outro horário.");
        }
        String id = UUID.randomUUID().toString();
        try {
            jdbc.update("""
                    INSERT INTO appointments (id, user_id, establishment_id, especialidade, data, horario)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """, id, userId, establishmentId, specialty, Date.valueOf(date), Time.valueOf(time));
        } catch (org.springframework.dao.DataIntegrityViolationException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Estabelecimento não encontrado ou agendamento inválido.");
        }
        return findBooking(id, userId);
    }

    @GetMapping("/api/agendamentos/{id}")
    public Map<String, Object> booking(HttpServletRequest request, @PathVariable String id) {
        return findBooking(id, auth.requireUserId(request));
    }

    @PutMapping("/api/agendamentos/{id}")
    public Map<String, Object> updateBooking(HttpServletRequest request, @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        String userId = auth.requireUserId(request);
        Map<String, Object> existing = findBooking(id, userId);
        LocalDate date = body.containsKey("data")
                ? parseDate(required(body, "data"))
                : LocalDate.parse(existing.get("data").toString());
        LocalTime time = body.containsKey("horario")
                ? parseTime(required(body, "horario"))
                : LocalTime.parse(existing.get("horario").toString());
        jdbc.update("""
                UPDATE appointments SET data = ?, horario = ?
                WHERE id = ? AND user_id = ? AND status <> 'cancelado'
                """, Date.valueOf(date), Time.valueOf(time), id, userId);
        return findBooking(id, userId);
    }

    @PostMapping("/api/agendamentos/{id}/confirmar")
    public Map<String, Object> confirmBooking(HttpServletRequest request, @PathVariable String id) {
        String userId = auth.requireUserId(request);
        findBooking(id, userId);
        jdbc.update("""
                UPDATE appointments SET status = 'confirmado'
                WHERE id = ? AND user_id = ? AND status = 'agendado'
                """, id, userId);
        return findBooking(id, userId);
    }

    @DeleteMapping("/api/agendamentos/{id}")
    public void cancelBooking(HttpServletRequest request, @PathVariable String id) {
        String userId = auth.requireUserId(request);
        findBooking(id, userId);
        jdbc.update("UPDATE appointments SET status = 'cancelado' WHERE id = ? AND user_id = ?",
                id, userId);
    }

    @GetMapping("/api/favoritos")
    public List<Map<String, Object>> favorites(HttpServletRequest request) {
        String userId = auth.requireUserId(request);
        return jdbc.query("""
                SELECT e.id, e.nome, e.tipo, e.rede_atendimento, e.endereco,
                    e.latitude, e.longitude, e.status
                FROM favorites f JOIN establishments e ON e.id = f.establishment_id
                WHERE f.user_id = ? ORDER BY f.created_at DESC
                """, (row, index) -> {
            Map<String, Object> place = new LinkedHashMap<>();
            place.put("id", row.getString("id"));
            place.put("nome", row.getString("nome"));
            place.put("tipo", row.getString("tipo"));
            place.put("redeAtendimento", row.getString("rede_atendimento"));
            place.put("endereco", row.getString("endereco"));
            place.put("latitude", row.getDouble("latitude"));
            place.put("longitude", row.getDouble("longitude"));
            place.put("status", row.getString("status"));
            place.put("favorito", true);
            return place;
        }, userId);
    }

    @PostMapping("/api/favoritos")
    public List<Map<String, Object>> addFavorite(HttpServletRequest request,
            @RequestBody Map<String, Object> body) {
        String userId = auth.requireUserId(request);
        String establishmentId = required(body, "estabelecimentoId");
        jdbc.update("""
                INSERT INTO favorites (user_id, establishment_id)
                VALUES (?, ?) AS incoming
                ON DUPLICATE KEY UPDATE establishment_id = incoming.establishment_id
                """, userId, establishmentId);
        return favorites(request);
    }

    @DeleteMapping("/api/favoritos/{establishmentId}")
    public List<Map<String, Object>> removeFavorite(HttpServletRequest request,
            @PathVariable String establishmentId) {
        jdbc.update("DELETE FROM favorites WHERE user_id = ? AND establishment_id = ?",
                auth.requireUserId(request), establishmentId);
        return favorites(request);
    }

    @GetMapping("/api/notificacoes")
    public List<Map<String, Object>> notifications(HttpServletRequest request) {
        String userId = auth.requireUserId(request);
        Integer count = jdbc.queryForObject(
                "SELECT count(*) FROM notifications WHERE user_id = ?", Integer.class, userId);
        if (count != null && count == 0) {
            jdbc.update("""
                    INSERT INTO notifications (id, user_id, titulo, descricao)
                    VALUES (?, ?, ?, ?)
                    """, UUID.randomUUID().toString(), userId, "Bem-vindo ao Easy Health",
                    "Seu perfil está pronto.");
        }
        return jdbc.query("""
                SELECT id, icon, titulo, descricao, lida, created_at
                FROM notifications WHERE user_id = ? ORDER BY created_at DESC
                """, (row, index) -> {
            Map<String, Object> notification = new LinkedHashMap<>();
            notification.put("id", row.getString("id"));
            notification.put("icon", row.getString("icon"));
            notification.put("titulo", row.getString("titulo"));
            notification.put("descricao", row.getString("descricao"));
            notification.put("lida", row.getBoolean("lida"));
            notification.put("createdAt", row.getTimestamp("created_at").toInstant().toString());
            return notification;
        }, userId);
    }

    @PutMapping("/api/notificacoes/{id}/lida")
    public List<Map<String, Object>> markNotificationRead(HttpServletRequest request,
            @PathVariable String id) {
        jdbc.update("UPDATE notifications SET lida = true WHERE id = ? AND user_id = ?",
                id, auth.requireUserId(request));
        return notifications(request);
    }

    @PutMapping("/api/notificacoes/marcar-todas-lidas")
    public List<Map<String, Object>> markAllNotificationsRead(HttpServletRequest request) {
        jdbc.update("UPDATE notifications SET lida = true WHERE user_id = ?",
                auth.requireUserId(request));
        return notifications(request);
    }

    @DeleteMapping("/api/notificacoes/{id}")
    public void deleteNotification(HttpServletRequest request, @PathVariable String id) {
        jdbc.update("DELETE FROM notifications WHERE id = ? AND user_id = ?",
                id, auth.requireUserId(request));
    }

    @GetMapping("/api/historico/consultas")
    public List<Map<String, Object>> consultationHistory(HttpServletRequest request) {
        String userId = auth.requireUserId(request);
        return jdbc.query("""
                SELECT a.id, a.user_id, a.establishment_id, e.nome AS establishment_name,
                    a.especialidade, a.data, a.horario, a.status
                FROM appointments a JOIN establishments e ON e.id = a.establishment_id
                WHERE a.user_id = ? AND a.status IN ('concluido', 'cancelado')
                ORDER BY a.data DESC, a.horario DESC
                """, (row, index) -> bookingView(
                        row.getString("id"), row.getString("user_id"), row.getString("establishment_id"),
                        row.getString("establishment_name"), row.getString("especialidade"),
                        row.getDate("data"), row.getTime("horario"), row.getString("status")), userId);
    }

    @GetMapping("/api/historico/consultas/{id}")
    public Map<String, Object> consultation(HttpServletRequest request, @PathVariable String id) {
        Map<String, Object> item = findBooking(id, auth.requireUserId(request));
        if (!"concluido".equals(item.get("status")) && !"cancelado".equals(item.get("status"))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Consulta não encontrada no histórico.");
        }
        return item;
    }

    @GetMapping({
        "/api/historico/exames",
        "/api/historico/vacinas",
        "/api/historico/medicamentos",
        "/api/historico/documentos"
    })
    public List<Map<String, Object>> emptyHealthHistory(HttpServletRequest request) {
        auth.requireUserId(request);
        return List.of();
    }

    private Map<String, Object> findBooking(String id, String userId) {
        return jdbc.query("""
                SELECT a.id, a.user_id, a.establishment_id, e.nome AS establishment_name,
                    a.especialidade, a.data, a.horario, a.status
                FROM appointments a JOIN establishments e ON e.id = a.establishment_id
                WHERE a.id = ? AND a.user_id = ?
                """, (row, index) -> bookingView(
                        row.getString("id"), row.getString("user_id"), row.getString("establishment_id"),
                        row.getString("establishment_name"), row.getString("especialidade"),
                        row.getDate("data"), row.getTime("horario"), row.getString("status")),
                id, userId).stream().findFirst().orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado."));
    }

    private static Map<String, Object> bookingView(String id, String userId, String establishmentId,
            String establishmentName, String specialty, Date date, Time time, String status) {
        Map<String, Object> booking = new LinkedHashMap<>();
        booking.put("id", id);
        booking.put("userId", userId);
        booking.put("establishmentId", establishmentId);
        booking.put("establishmentNome", establishmentName);
        booking.put("especialidade", specialty);
        booking.put("local", establishmentName);
        booking.put("data", date.toString());
        booking.put("horario", time.toLocalTime().toString().substring(0, 5));
        booking.put("status", status);
        booking.put("medico", "Dr. Carlos Mendes");
        booking.put("medicoCrm", "CRM 12345");
        booking.put("valor", "R$ 280");
        return booking;
    }

    private static String required(Map<String, Object> body, String name) {
        Object value = body.get(name);
        if (!(value instanceof String text) || text.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campo obrigatório: " + name + ".");
        }
        return text.trim();
    }

    private static LocalDate parseDate(String value) {
        try {
            return LocalDate.parse(value);
        } catch (java.time.format.DateTimeParseException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data inválida. Use o formato AAAA-MM-DD.");
        }
    }

    private static LocalTime parseTime(String value) {
        try {
            return LocalTime.parse(value);
        } catch (java.time.format.DateTimeParseException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Horário inválido. Use o formato HH:MM.");
        }
    }
}
