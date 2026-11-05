package br.com.easyhealth.controller;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Stream;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import br.com.easyhealth.service.AppointmentAvailability;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class CatalogController {
    private static final String ESTABLISHMENT_SELECT = """
            SELECT i.id, i.nome, i.tipo, i.rede_atendimento,
                i.endereco_completo AS endereco, i.avaliacao, i.avaliacoes_count,
                i.status, i.status_label, i.horario_padrao AS horario, i.telefone,
                COALESCE((
                    SELECT JSON_ARRAYAGG(e.nome)
                    FROM easyhealth_institutions.instituicao_especialidades ie
                    JOIN easyhealth_institutions.especialidades e ON e.id = ie.especialidade_id
                    WHERE ie.instituicao_id = i.id AND e.ativo = TRUE
                ), JSON_ARRAY()) AS especialidades,
                COALESCE((
                    SELECT JSON_ARRAYAGG(c.nome)
                    FROM easyhealth_institutions.instituicao_convenios ic
                    JOIN easyhealth_institutions.convenios c ON c.id = ic.convenio_id
                    WHERE ic.instituicao_id = i.id AND c.ativo = TRUE
                ), JSON_ARRAY()) AS convenios,
                i.latitude, i.longitude
            FROM easyhealth_institutions.instituicoes_saude i
            """;

    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public CatalogController(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    @GetMapping({"/api/estabelecimentos", "/api/estabelecimentos/busca"})
    public List<Map<String, Object>> searchEstablishments(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "todos") String tipo,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Double raioKm) {
        List<Map<String, Object>> establishments = jdbc.query(
                ESTABLISHMENT_SELECT + " ORDER BY i.nome",
                (row, index) -> mapEstablishment(row));
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
        return jdbc.query("""
                SELECT e.nome
                FROM easyhealth_institutions.instituicao_especialidades ie
                JOIN easyhealth_institutions.especialidades e ON e.id = ie.especialidade_id
                WHERE ie.instituicao_id = ? AND e.ativo = TRUE
                ORDER BY e.nome
                """, (row, index) -> row.getString("nome"), id);
    }

    @GetMapping("/api/estabelecimentos/{id}/precos")
    public List<Map<String, Object>> prices(@PathVariable String id) {
        findEstablishment(id);
        return List.of(Map.of("servico", "Consulta", "valor", "R$ 280"));
    }

    @GetMapping("/api/estabelecimentos/{id}/horarios-disponiveis")
    public List<String> availableTimes(@PathVariable String id, @RequestParam LocalDate data) {
        findEstablishment(id);
        return AppointmentAvailability.forDate(jdbc, id, data);
    }

    @GetMapping("/api/especialidades")
    public List<String> specialties() {
        return jdbc.query("""
                SELECT nome FROM easyhealth_institutions.especialidades
                WHERE ativo = TRUE ORDER BY nome
                """, (row, index) -> row.getString("nome"));
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
        Stream<Map<String, Object>> hospitals = searchEstablishments(latitude, longitude, "todos", null, null)
                .stream()
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
                });
        if (latitude != null && longitude != null) {
            // "Próximos": do mais perto para o mais longe (sem coordenadas, mantém a ordem por nome).
            hospitals = hospitals.sorted(Comparator.<Map<String, Object>>comparingDouble(
                    hospital -> ((Number) hospital.get("distanciaKm")).doubleValue()));
        }
        return hospitals.toList();
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

    private Map<String, Object> findEstablishment(String id) {
        return jdbc.query(ESTABLISHMENT_SELECT + " WHERE i.id = ?",
                (row, index) -> mapEstablishment(row), id).stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Estabelecimento não encontrado."));
    }

    private Map<String, Object> mapEstablishment(ResultSet row) throws SQLException {
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
        place.put("redeAtendimento", row.getString("rede_atendimento"));
        place.put("endereco", address);
        place.put("avaliacao", row.getObject("avaliacao", Double.class));
        place.put("avaliacoesCount", row.getObject("avaliacoes_count", Integer.class));
        place.put("status", status);
        place.put("statusLabel", row.getString("status_label"));
        place.put("horario", row.getString("horario"));
        place.put("telefone", row.getString("telefone"));
        place.put("especialidades", readJsonList(row.getString("especialidades")));
        place.put("convenios", readJsonList(row.getString("convenios")));
        place.put("latitude", latitude);
        place.put("longitude", longitude);
        return place;
    }

    private List<String> readJsonList(String value) throws SQLException {
        try {
            return value == null ? List.of() : objectMapper.readValue(value, new TypeReference<>() {});
        } catch (JsonProcessingException exception) {
            throw new SQLException("Dados JSON inválidos no catálogo do banco de dados.", exception);
        }
    }

    private static Map<String, Object> withDistance(Map<String, Object> place,
            Double latitude, Double longitude) {
        Map<String, Object> result = new LinkedHashMap<>(place);
        if (latitude != null && longitude != null
                && place.get("latitude") instanceof Number
                && place.get("longitude") instanceof Number) {
            double distance = distanceKm(latitude, longitude,
                    ((Number) place.get("latitude")).doubleValue(),
                    ((Number) place.get("longitude")).doubleValue());
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
}
