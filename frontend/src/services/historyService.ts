import { api } from "./api";
import { HISTORY_MOCK, ConsultaHistoricoMock } from "@/data/historyMock";

export const historyService = {
  async listConsultas(): Promise<ConsultaHistoricoMock[]> {
    try {
      const { data } = await api.get<ConsultaHistoricoMock[]>("/api/historico/consultas");
      return data;
    } catch {
      return HISTORY_MOCK;
    }
  },

  async getConsultaById(id: string): Promise<ConsultaHistoricoMock | undefined> {
    try {
      const { data } = await api.get<ConsultaHistoricoMock>(`/api/historico/consultas/${id}`);
      return data;
    } catch {
      return HISTORY_MOCK.find((c) => c.id === id);
    }
  },

  async listExames() {
    try {
      const { data } = await api.get("/api/historico/exames");
      return data;
    } catch {
      return [];
    }
  },

  async listVacinas() {
    try {
      const { data } = await api.get("/api/historico/vacinas");
      return data;
    } catch {
      return [];
    }
  },

  async listMedicamentos() {
    try {
      const { data } = await api.get("/api/historico/medicamentos");
      return data;
    } catch {
      return [];
    }
  },
};
