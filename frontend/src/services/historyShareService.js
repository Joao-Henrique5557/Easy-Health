import { api } from "./api";
import { authService } from "./authService";

async function getAuthConfig() {
  const token =
    (await authService.getAccessToken?.()) ||
    (await authService.getToken?.()) ||
    null;
  return token ? { params: { accessToken: token } } : {};
}

export const historyShareService = {
  async shareWithDoctor(medicoId) {
    const { data } = await api.post("/api/historico/compartilhamentos", {
      medicoId: medicoId.trim(),
    });
    return data;
  },

  async listShares() {
    const { data } = await api.get("/api/historico/compartilhamentos");
    return Array.isArray(data) ? data : [];
  },

  async revokeShare(compartilhamentoId) {
    await api.delete(`/api/historico/compartilhamentos/${compartilhamentoId}`);
  },

  async getPatientRecordsAsDoctor(pacienteId, tipo = null) {
    const config = await getAuthConfig();
    if (tipo) {
      config.params = { ...(config.params || {}), tipo };
    }
    const { data } = await api.get(
      `/api/medicos/pacientes/${pacienteId}/historico/registros`,
      config
    );
    return Array.isArray(data) ? data : [];
  },
};