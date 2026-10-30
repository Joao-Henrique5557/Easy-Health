import { api } from "./api";
import { tokenStorage } from "./tokenStorage";
export const bookingService = {
  async create(payload) {
    const { data } = await api.post("/api/agendamentos", payload);
    return data;
  },
  async listUpcoming() {
    if (!(await tokenStorage.hasAccessToken())) {
      return [];
    }
    const { data } = await api.get("/api/agendamentos");
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/api/agendamentos/${id}`);
    return data;
  }
};
