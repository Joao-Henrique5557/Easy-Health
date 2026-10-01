package br.com.easyhealth.controller;

import java.util.Map;
import java.util.Set;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {
    private static final Set<String> EMERGENCY_WORDS = Set.of(
            "emergência", "emergencia", "socorro", "desmaio", "engasgo", "sangramento");

    @PostMapping("/message")
    public Map<String, Object> message(@RequestBody Map<String, Object> body) {
        Object rawMessage = body.get("message");
        String message = rawMessage instanceof String text ? text.toLowerCase() : "";
        if (EMERGENCY_WORDS.stream().anyMatch(message::contains)) {
            return Map.of(
                    "reply", "Se houver risco imediato, ligue para o SAMU pelo 192 agora. "
                            + "Não consigo diagnosticar nem substituir atendimento profissional.",
                    "screen", "emergencia");
        }
        if (message.contains("socorro") || message.contains("engasgo")) {
            return Map.of("reply", "Veja os guias de primeiros socorros. Em uma emergência, ligue 192.",
                    "screen", "primeiros_socorros");
        }
        String screen = navigationScreen(message);
        String reply = screen == null
                ? "Posso ajudar você a encontrar recursos do Easy Health. Não faço diagnósticos nem "
                        + "prescrevo tratamentos. Em uma emergência, ligue para o 192."
                : "Posso ajudar com isso. Abra a seção indicada no aplicativo. "
                        + "Não faço diagnósticos nem prescrevo tratamentos.";
        return Map.of("reply", reply, "screen", screen == null ? "" : screen);
    }

    private static String navigationScreen(String message) {
        if (containsAny(message, "consulta", "clínica", "clinica", "hospital", "médico", "medico", "buscar")) {
            return "busca_atendimento";
        }
        if (containsAny(message, "exame", "histórico", "historico", "vacina")) {
            return "historico";
        }
        if (containsAny(message, "perfil", "meus dados", "conta")) {
            return "perfil";
        }
        if (containsAny(message, "primeiros socorros", "queimadura", "desmaio")) {
            return "primeiros_socorros";
        }
        if (containsAny(message, "início", "inicio", "home")) {
            return "home";
        }
        return null;
    }

    private static boolean containsAny(String text, String... words) {
        for (String word : words) {
            if (text.contains(word)) {
                return true;
            }
        }
        return false;
    }
}
