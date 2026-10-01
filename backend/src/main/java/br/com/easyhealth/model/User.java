package br.com.easyhealth.model;

import java.util.LinkedHashMap;
import java.util.Map;

public record User(
        String id,
        String nome,
        String email,
        String senhaHash,
        String telefone,
        String dataNascimento,
        String avatarUrl,
        String tipoSanguineo,
        String alergias,
        String medicamentosEmUso,
        String planoDeSaude,
        boolean emailVerificado,
        String contatoEmergenciaNome,
        String contatoEmergenciaTelefone,
        String contatoEmergenciaParentesco) {

    public Map<String, Object> publicView() {
        Map<String, Object> view = new LinkedHashMap<>();
        view.put("id", id);
        view.put("nome", nome);
        view.put("email", email);
        view.put("telefone", telefone);
        view.put("dataNascimento", dataNascimento);
        view.put("avatarUrl", avatarUrl);
        view.put("tipoSanguineo", tipoSanguineo);
        view.put("alergias", alergias);
        view.put("medicamentosEmUso", medicamentosEmUso);
        view.put("planoDeSaude", planoDeSaude);
        view.put("emailVerificado", emailVerificado);
        view.put("contatoEmergenciaNome", contatoEmergenciaNome);
        view.put("contatoEmergenciaTelefone", contatoEmergenciaTelefone);
        view.put("contatoEmergenciaParentesco", contatoEmergenciaParentesco);
        return view;
    }
}
