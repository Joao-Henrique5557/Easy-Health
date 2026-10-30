package br.com.easyhealth.controller;

import java.text.Normalizer;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {
    private static final Pattern DIACRITICS = Pattern.compile("\\p{M}+");

    // Aplicado sobre o texto em minúsculas e sem acentos. O limite de palavra (\b) impede que
    // "socorro" case dentro de "primeiros socorros" e que "avc" case no meio de outras palavras.
    private static final Pattern EMERGENCY = Pattern.compile(String.join("|",
            "\\bemergenci\\w*",
            "\\bsocorro\\b",
            "\\bengasg\\w*",
            "\\bdesmai\\w*",
            "\\bsangramento\\b",
            "\\bsangrand\\w*",
            "\\bhemorragia\\b",
            "\\bfalta de ar\\b",
            "\\bnao (consegue|consigo|conseguem) respirar\\b",
            "\\bdificuldade (para|de|em) respirar\\b",
            "\\bdor (\\w+ ){0,2}(no|do|de) peito\\b",
            "\\binfarto\\b",
            "\\bavc\\b",
            "\\bderrame\\b",
            "\\bconvuls\\w*",
            "\\binconsciente\\b",
            "\\boverdose\\b",
            "\\benvenen\\w*"));

    @PostMapping("/message")
    public Map<String, Object> message(@RequestBody Map<String, Object> body) {
        Object rawMessage = body.get("message");
        String message = rawMessage instanceof String text ? normalize(text) : "";
        if (EMERGENCY.matcher(message).find()) {
            return Map.of(
                    "reply", "Se houver risco imediato, ligue para o SAMU pelo 192 agora. "
                            + "Não consigo diagnosticar nem substituir atendimento profissional.",
                    "screen", "emergencia");
        }
        String screen = navigationScreen(message);
        String reply = screen == null
                ? "Posso ajudar você a encontrar recursos do Easy Health. Não faço diagnósticos nem "
                        + "prescrevo tratamentos. Em uma emergência, ligue para o 192."
                : "Posso ajudar com isso. Abra a seção indicada no aplicativo. "
                        + "Não faço diagnósticos nem prescrevo tratamentos.";
        return Map.of("reply", reply, "screen", screen == null ? "" : screen);
    }

    // Recebe o texto já normalizado (minúsculas, sem acentos).
    private static String navigationScreen(String message) {
        if (containsAny(message, "consulta", "clinica", "hospital", "medico", "buscar")) {
            return "busca_atendimento";
        }
        if (containsAny(message, "exame", "historico", "vacina")) {
            return "historico";
        }
        if (containsAny(message, "perfil", "meus dados", "conta")) {
            return "perfil";
        }
        if (containsAny(message, "primeiros socorros", "queimadura")) {
            return "primeiros_socorros";
        }
        if (containsAny(message, "inicio", "home")) {
            return "home";
        }
        return null;
    }

    private static String normalize(String text) {
        String decomposed = Normalizer.normalize(text.toLowerCase(Locale.ROOT), Normalizer.Form.NFD);
        return DIACRITICS.matcher(decomposed).replaceAll("");
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
