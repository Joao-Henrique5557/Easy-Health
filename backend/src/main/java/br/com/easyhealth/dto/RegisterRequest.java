package br.com.easyhealth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Informe seu nome.")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres.")
        String nome,
        @NotBlank(message = "Informe seu e-mail.")
        @Email(message = "Informe um e-mail válido.")
        @Size(max = 254, message = "O e-mail é muito longo.")
        String email,
        @NotBlank(message = "Informe sua senha.")
        @Size(min = 8, max = 72, message = "A senha deve ter entre 8 e 72 caracteres.")
        String senha,
        String telefone,
        String dataNascimento) {
}
