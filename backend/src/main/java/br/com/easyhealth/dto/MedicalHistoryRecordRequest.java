package br.com.easyhealth.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MedicalHistoryRecordRequest(
        @NotBlank(message = "Selecione o tipo de registro.")
        @Pattern(regexp = "exame|vacina|medicamento|documento", message = "Tipo de registro inválido.")
        String tipo,
        @NotBlank(message = "Informe o título do registro.")
        @Size(max = 180, message = "O título deve ter no máximo 180 caracteres.")
        String titulo,
        @NotNull(message = "Informe a data do registro.")
        LocalDate data,
        @Size(max = 4000, message = "A descrição deve ter no máximo 4000 caracteres.")
        String descricao,
        @Size(max = 180, message = "O profissional deve ter no máximo 180 caracteres.")
        String profissional,
        @Size(max = 255, message = "O local deve ter no máximo 255 caracteres.")
        String local) {
}
