package br.com.easyhealth.service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;

public final class AppointmentAvailability {
    private static final ZoneId BRAZIL_ZONE = ZoneId.of("America/Sao_Paulo");
    private static final List<String> SLOTS = List.of(
            "08:00", "09:30", "10:00", "11:30", "14:00", "15:30", "16:00");

    private AppointmentAvailability() {
    }

    public static List<String> forDate(JdbcTemplate jdbc, String establishmentId, LocalDate date) {
        return forDate(jdbc, establishmentId, date, false);
    }

    public static List<String> forDate(
            JdbcTemplate jdbc, String establishmentId, LocalDate date, boolean lockBookings) {
        LocalDate today = LocalDate.now(BRAZIL_ZONE);
        if (date.isBefore(today)) {
            return List.of();
        }
        String lockClause = lockBookings ? " FOR UPDATE" : "";
        List<String> bookedTimes = jdbc.query("""
                SELECT horario FROM appointments
                WHERE establishment_id = ? AND data = ? AND status <> 'cancelado'
                """ + lockClause,
                (row, index) -> row.getTime("horario").toLocalTime().toString().substring(0, 5),
                establishmentId, Date.valueOf(date));
        LocalTime now = LocalTime.now(BRAZIL_ZONE);
        return SLOTS.stream()
                .filter(slot -> !bookedTimes.contains(slot))
                .filter(slot -> !date.equals(today) || LocalTime.parse(slot).isAfter(now))
                .toList();
    }

    public static boolean isSlot(String value) {
        return SLOTS.contains(value);
    }
}
