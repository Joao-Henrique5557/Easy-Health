import { api } from "./api";
import { HISTORY_MOCK } from "@/data/historyMock";
export const historyService = {
  async listConsultas() {
    try {
      const {
        data
      } = await api.get("/api/historico/consultas");
      return data;
    } catch {
      return HISTORY_MOCK;
    }
  },
  async getConsultaById(id) {
    try {
      const {
        data
      } = await api.get(`/api/historico/consultas/${id}`);
      return data;
    } catch {
      return HISTORY_MOCK.find(c => c.id === id);
    }
  },
  async listExames() {
    try {
      const {
        data
      } = await api.get("/api/historico/exames");
      return data;
    } catch {
      return [];
    }
  },
  async listVacinas() {
    try {
      const {
        data
      } = await api.get("/api/historico/vacinas");
      return data;
    } catch {
      return [];
    }
  },
  async listMedicamentos() {
    try {
      const {
        data
      } = await api.get("/api/historico/medicamentos");
      return data;
    } catch {
      return [];
    }
  }
};
