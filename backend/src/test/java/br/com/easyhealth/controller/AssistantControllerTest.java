package br.com.easyhealth.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;

import org.junit.jupiter.api.Test;

class AssistantControllerTest {
    private final AssistantController assistant = new AssistantController();

    @Test
    void emergencyMessagePointsToEmergencyScreenAndRealHelp() {
        Map<String, Object> response = assistant.message(Map.of("message", "estou com falta de ar, socorro"));

        assertEquals("emergencia", response.get("screen"));
        org.junit.jupiter.api.Assertions.assertTrue(response.get("reply").toString().contains("192"));
    }

    @Test
    void appointmentQuestionSuggestsCareSearch() {
        Map<String, Object> response = assistant.message(Map.of("message", "quero encontrar uma clínica"));

        assertEquals("busca_atendimento", response.get("screen"));
    }
}
