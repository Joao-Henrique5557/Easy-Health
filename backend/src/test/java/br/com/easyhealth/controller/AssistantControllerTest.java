package br.com.easyhealth.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;

import org.junit.jupiter.api.Test;

class AssistantControllerTest {
    private final AssistantController assistant = new AssistantController();

    @Test
    void emergencyMessagePointsToEmergencyScreenAndRealHelp() {
        Map<String, Object> response = assistant.message(Map.of("message", "estou com falta de ar, socorro"));

        assertEquals("emergencia", response.get("screen"));
        assertTrue(response.get("reply").toString().contains("192"));
    }

    @Test
    void chestPainAndBreathingTroubleTriggerEmergencyMode() {
        Map<String, Object> response = assistant.message(
                Map.of("message", "meu pai está com dor forte no peito e não consegue respirar"));

        assertEquals("emergencia", response.get("screen"));
    }

    @Test
    void emergencyDetectionIgnoresAccentsAndCase() {
        assertEquals("emergencia",
                assistant.message(Map.of("message", "Meu amigo está ENGASGADO")).get("screen"));
        assertEquals("emergencia",
                assistant.message(Map.of("message", "ela teve um DESMAIO agora")).get("screen"));
    }

    @Test
    void firstAidBrowsingIsNotTreatedAsEmergency() {
        Map<String, Object> response = assistant.message(Map.of("message", "quero ver os primeiros socorros"));

        assertEquals("primeiros_socorros", response.get("screen"));
    }

    @Test
    void appointmentQuestionSuggestsCareSearch() {
        Map<String, Object> response = assistant.message(Map.of("message", "quero encontrar uma clínica"));

        assertEquals("busca_atendimento", response.get("screen"));
    }

    @Test
    void historyQuestionWithAccentsSuggestsHistoryScreen() {
        Map<String, Object> response = assistant.message(Map.of("message", "onde vejo meu histórico?"));

        assertEquals("historico", response.get("screen"));
    }

    @Test
    void unrelatedOrMissingMessageGetsGenericReplyWithoutScreen() {
        assertEquals("", assistant.message(Map.of("message", "bom dia")).get("screen"));
        assertEquals("", assistant.message(Map.of()).get("screen"));
    }
}
