import { api } from "./api";

export const establishmentsService = {
  async search(filters) {
    const { data } = await api.get("/api/estabelecimentos/busca", {
      params: filters
    });
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/api/estabelecimentos/${id}`);
    return data;
  },
  async getHorariosDisponiveis(id, data) {
    const { data: horarios } = await api.get(`/api/estabelecimentos/${id}/horarios-disponiveis`, {
      params: { data }
    });
    return horarios;
  }
};
