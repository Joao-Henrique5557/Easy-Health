package br.com.easyhealth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GoogleAuthRequest(
        @NotBlank(message = "Token Google obrigatório.")
        @Size(max = 8192, message = "Token Google inválido.")
        String idToken) {
}
