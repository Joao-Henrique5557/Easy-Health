import { api } from "./api";
import { tokenStorage } from "./tokenStorage";

async function loadIfAuthenticated(path) {
  if (!(await tokenStorage.hasAccessToken())) {
    return [];
  }
  const { data } = await api.get(path);
  return data;
}

export const historyService = {
  async listConsultas() {
    return loadIfAuthenticated("/api/historico/consultas");
  },
  async getConsultaById(id) {
    if (!(await tokenStorage.hasAccessToken())) return null;
    const { data } = await api.get(`/api/historico/consultas/${id}`);
    return data;
  },
  async listExames() {
    return loadIfAuthenticated("/api/historico/registros?tipo=exame");
  },
  async listVacinas() {
    return loadIfAuthenticated("/api/historico/registros?tipo=vacina");
  },
  async listMedicamentos() {
    return loadIfAuthenticated("/api/historico/registros?tipo=medicamento");
  },
  async listDocumentos() {
    return loadIfAuthenticated("/api/historico/registros?tipo=documento");
  },
  async createRecord(payload) {
    const { data } = await api.post("/api/historico/registros", payload);
    return data;
  },
  async updateRecord(id, payload) {
    const { data } = await api.put(`/api/historico/registros/${id}`, payload);
    return data;
  },
  async deleteRecord(id) {
    await api.delete(`/api/historico/registros/${id}`);
  }
};
