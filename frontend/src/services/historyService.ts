import { api } from "./api";

export interface ConsultaHistorico {
  id: string;
  tipo: "consulta";
  descricao: string;
  data: string;
}

export interface ExameHistorico {
  id: string;
  tipo: "exame";
  descricao: string;
  data: string;
}

export const historyService = {
  async listConsultas() {
    const { data } = await api.get<ConsultaHistorico[]>("/api/historico/consultas");
    return data;
  },
  async listExames() {
    const { data } = await api.get<ExameHistorico[]>("/api/historico/exames");
    return data;
  },
};
