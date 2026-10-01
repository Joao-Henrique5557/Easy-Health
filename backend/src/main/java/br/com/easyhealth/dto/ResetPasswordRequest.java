package br.com.easyhealth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Informe o código de recuperação.") String codigo,
        @NotBlank(message = "Informe a nova senha.")
        @Size(min = 8, max = 72, message = "A senha deve ter entre 8 e 72 caracteres.")
        String novaSenha) {
}
