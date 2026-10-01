package br.com.easyhealth.controller;

import java.sql.Array;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class CatalogController {
    private static final List<String> SPECIALTIES = List.of(
            "Cardiologia", "Clínica médica", "Dermatologia", "Pediatria");
    private static final List<String> AVAILABLE_TIMES = List.of(
            "08:00", "09:30", "10:00", "11:30", "14:00", "15:30", "16:00");
    private final JdbcTemplate jdbc;

    public CatalogController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/api/primeiros-socorros")
    public List<Map<String, Object>> guides(@RequestParam(required = false) String query) {
        if (query == null || query.isBlank()) {
            return allGuides();
        }
        return jdbc.query("""
                SELECT id, titulo, resumo, icon, passos FROM first_aid_guides
                WHERE lower(titulo) LIKE ? OR lower(resumo) LIKE ?
                ORDER BY titulo
                """, CatalogController::mapGuide, contains(query), contains(query));
    }

    @GetMapping("/api/primeiros-socorros/busca")
    public List<Map<String, Object>> searchGuides(@RequestParam(defaultValue = "") String query) {
        return guides(query);
    }

    @GetMapping("/api/primeiros-socorros/categorias")
    public List<Map<String, Object>> guideCategories() {
        return allGuides().stream().map(guide -> {
            Map<String, Object> category = new LinkedHashMap<>();
            category.put("id", guide.get("id"));
            category.put("titulo", guide.get("titulo"));
            category.put("icon", guide.get("icon"));
            return category;
        }).toList();
    }

    @GetMapping("/api/primeiros-socorros/{id}")
    public Map<String, Object> guide(@PathVariable String id) {
        return jdbc.query("""
                SELECT id, titulo, resumo, icon, passos FROM first_aid_guides WHERE id = ?
                """, CatalogController::mapGuide, id).stream().findFirst().orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Guia não encontrado."));
    }

    @GetMapping({"/api/estabelecimentos", "/api/estabelecimentos/busca"})
    public List<Map<String, Object>> searchEstablishments(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "todos") String tipo,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Double raioKm) {
        List<Map<String, Object>> establishments = jdbc.query("""
                SELECT id, nome, tipo, endereco, latitude, longitude, status
                FROM establishments ORDER BY nome
                """, (row, index) -> mapEstablishment(row));
        return establishments.stream()
                .filter(place -> "todos".equalsIgnoreCase(tipo)
                        || tipo.equalsIgnoreCase((String) place.get("tipo")))
                .filter(place -> query == null || query.isBlank()
                        || ((String) place.get("nome")).toLowerCase(Locale.ROOT)
                                .contains(query.toLowerCase(Locale.ROOT)))
                .map(place -> withDistance(place, latitude, longitude))
                .filter(place -> raioKm == null
                        || !place.containsKey("distanciaKm")
                        || (double) place.get("distanciaKm") <= raioKm)
                .toList();
    }

    @GetMapping("/api/estabelecimentos/{id}")
    public Map<String, Object> establishment(@PathVariable String id) {
        return findEstablishment(id);
    }

    @GetMapping("/api/estabelecimentos/{id}/especialidades")
    public List<String> establishmentSpecialties(@PathVariable String id) {
        findEstablishment(id);
        return SPECIALTIES;
    }

    @GetMapping("/api/estabelecimentos/{id}/precos")
    public List<Map<String, Object>> prices(@PathVariable String id) {
        findEstablishment(id);
        return List.of(Map.of("servico", "Consulta", "valor", "R$ 280"));
    }

    @GetMapping("/api/estabelecimentos/{id}/horarios-disponiveis")
    public List<String> availableTimes(@PathVariable String id) {
        findEstablishment(id);
        return AVAILABLE_TIMES;
    }

    @GetMapping("/api/especialidades")
    public List<String> specialties() {
        return SPECIALTIES;
    }

    @GetMapping("/api/emergencia/contatos")
    public List<Map<String, String>> emergencyContacts() {
        return List.of(
                contact("SAMU", "192", "Emergências de saúde"),
                contact("Bombeiros", "193", "Incêndios e resgates"),
                contact("Polícia", "190", "Segurança pública"));
    }

    @GetMapping("/api/emergencia/hospitais-proximos")
    public List<Map<String, Object>> nearbyHospitals(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude) {
        return searchEstablishments(latitude, longitude, "todos", null, null).stream()
                .filter(place -> "hospital".equals(place.get("tipo")) || "upa".equals(place.get("tipo")))
                .map(place -> {
                    Map<String, Object> hospital = new LinkedHashMap<>();
                    hospital.put("id", place.get("id"));
                    hospital.put("nome", place.get("nome"));
                    hospital.put("endereco", place.get("endereco"));
                    hospital.put("latitude", place.get("latitude"));
                    hospital.put("longitude", place.get("longitude"));
                    hospital.put("distanciaKm", place.getOrDefault("distanciaKm", 0.0));
                    hospital.put("aberto24h", true);
                    return hospital;
                }).toList();
    }

    @GetMapping("/api/emergencia/rotas")
    public Map<String, Object> emergencyRoute(
            @RequestParam String estabelecimentoId,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude) {
        Map<String, Object> place = findEstablishment(estabelecimentoId);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("estabelecimento", place);
        if (latitude != null && longitude != null) {
            result.put("distanciaKm", Math.round(distanceKm(latitude, longitude,
                    (double) place.get("latitude"), (double) place.get("longitude")) * 10.0) / 10.0);
        }
        result.put("observacao", "A distância é em linha reta; use seu aplicativo de mapas para traçar a rota.");
        return result;
    }

    @GetMapping("/api/localizacao")
    public Map<String, Object> location(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) String endereco) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("latitude", latitude == null ? 0 : latitude);
        result.put("longitude", longitude == null ? 0 : longitude);
        result.put("endereco", endereco);
        return result;
    }

    @GetMapping("/api/localizacao/distancia")
    public Map<String, Double> distance(
            @RequestParam double origemLat,
            @RequestParam double origemLng,
            @RequestParam double destinoLat,
            @RequestParam double destinoLng) {
        double km = distanceKm(origemLat, origemLng, destinoLat, destinoLng);
        return Map.of("distanciaKm", Math.round(km * 10.0) / 10.0);
    }

    @GetMapping({"/api/localizacao/geocode", "/api/localizacao/reverse-geocode"})
    public void geocodingUnavailable() {
        throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                "Geocodificação externa não configurada. O app pode abrir o endereço no aplicativo de mapas.");
    }

    private List<Map<String, Object>> allGuides() {
        return jdbc.query("""
                SELECT id, titulo, resumo, icon, passos FROM first_aid_guides ORDER BY titulo
                """, CatalogController::mapGuide);
    }

    private Map<String, Object> findEstablishment(String id) {
        return jdbc.query("""
                SELECT id, nome, tipo, endereco, latitude, longitude, status
                FROM establishments WHERE id = ?
                """, (row, index) -> mapEstablishment(row), id).stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Estabelecimento não encontrado."));
    }

    private static Map<String, Object> mapGuide(ResultSet row, int index) throws SQLException {
        Array sqlSteps = row.getArray("passos");
        List<String> steps = sqlSteps == null
                ? List.of()
                : Arrays.asList((String[]) sqlSteps.getArray());
        Map<String, Object> guide = new LinkedHashMap<>();
        guide.put("id", row.getString("id"));
        guide.put("titulo", row.getString("titulo"));
        guide.put("resumo", row.getString("resumo"));
        guide.put("icon", row.getString("icon"));
        guide.put("passos", steps);
        return guide;
    }

    private static Map<String, Object> mapEstablishment(ResultSet row) throws SQLException {
        String id = row.getString("id");
        String type = row.getString("tipo");
        String address = row.getString("endereco");
        double latitude = row.getDouble("latitude");
        double longitude = row.getDouble("longitude");
        String status = row.getString("status");
        Map<String, Object> place = new LinkedHashMap<>();
        place.put("id", id);
        place.put("nome", row.getString("nome"));
        place.put("tipo", type);
        place.put("redeAtendimento", type.equals("hospital") ? "privado" : "publico");
        place.put("endereco", address);
        place.put("avaliacao", 4.8);
        place.put("avaliacoesCount", 320);
        place.put("status", status);
        place.put("statusLabel", status.equalsIgnoreCase("aberto") ? "Aberto agora" : "Fechado");
        place.put("horario", type.equals("hospital") || type.equals("upa") ? "24h" : "Segunda a sexta");
        place.put("latitude", latitude);
        place.put("longitude", longitude);
        return place;
    }

    private static Map<String, Object> withDistance(Map<String, Object> place,
            Double latitude, Double longitude) {
        Map<String, Object> result = new LinkedHashMap<>(place);
        if (latitude != null && longitude != null) {
            double distance = distanceKm(latitude, longitude,
                    (double) place.get("latitude"), (double) place.get("longitude"));
            result.put("distanciaKm", Math.round(distance * 10.0) / 10.0);
        }
        return result;
    }

    private static double distanceKm(double lat1, double lon1, double lat2, double lon2) {
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private static Map<String, String> contact(String label, String number, String description) {
        return Map.of("label", label, "numero", number, "descricao", description);
    }

    private static String contains(String value) {
        return "%" + value.trim().toLowerCase(Locale.ROOT) + "%";
    }
}
