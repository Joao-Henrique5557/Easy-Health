import { api } from "./api";
import { HISTORY_MOCK } from "@/data/historyMock";
import { tokenStorage } from "./tokenStorage";
async function loadIfAuthenticated(path, fallback) {
  if (!(await tokenStorage.hasAccessToken())) {
    return fallback;
  }
  try {
    const {
      data
    } = await api.get(path);
    return data;
  } catch {
    return fallback;
  }
}
export const historyService = {
  async listConsultas() {
    return loadIfAuthenticated("/api/historico/consultas", HISTORY_MOCK);
  },
  async getConsultaById(id) {
    const consultas = await loadIfAuthenticated(`/api/historico/consultas/${id}`, HISTORY_MOCK.find(c => c.id === id));
    return consultas;
  },
  async listExames() {
    return loadIfAuthenticated("/api/historico/exames", []);
  },
  async listVacinas() {
    return loadIfAuthenticated("/api/historico/vacinas", []);
  },
  async listMedicamentos() {
    return loadIfAuthenticated("/api/historico/medicamentos", []);
  }
};
