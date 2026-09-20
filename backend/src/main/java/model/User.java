package model;

/** Bean de usuário retornado pela API (senha nunca é serializada). */
public class User {
    public String id, nome, email, telefone, avatarUrl, tipoSanguineo, alergias,
            medicamentosEmUso, planoDeSaude, contatoEmergenciaNome,
            contatoEmergenciaTelefone, contatoEmergenciaParentesco;
    public String dataNascimento;
    public boolean emailVerificado;
    public transient String senhaHash;
}
