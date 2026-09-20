import { api } from "./api";
const VISITOR_PROFILE = {
  id: "visitor",
  nome: "Visitante",
  email: "",
  telefone: "",
  dataNascimento: "",
  avatarUrl: null,
  tipoSanguineo: "",
  alergias: "",
  medicamentosEmUso: "",
  planoDeSaude: "",
  contatoEmergenciaNome: "",
  contatoEmergenciaParentesco: "",
  contatoEmergenciaTelefone: ""
};
function calcularIdade(dataNascimentoISO) {
  const nascimento = new Date(dataNascimentoISO);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario = hoje.getMonth() < nascimento.getMonth() || hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate();
  if (aindaNaoFezAniversario) idade -= 1;
  return idade;
}
export const profileService = {
  async getMe() {
    try {
      const {
        data
      } = await api.get("/api/users/me");
      return data;
    } catch {
      return VISITOR_PROFILE;
    }
  },
  async updateMe(payload) {
    const {
      data
    } = await api.put("/api/users/me", payload);
    return data;
  },
  calcularIdade
};
