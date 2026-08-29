import { api } from "./api";
import { FIRST_AID_GUIDES, FirstAidGuide } from "@/data/firstAidContent";

export const firstAidService = {
  async list(): Promise<FirstAidGuide[]> {
    try {
      const { data } = await api.get<FirstAidGuide[]>("/api/primeiros-socorros");
      return data;
    } catch {
      // Sem conexão ou API fora do ar: nunca deixe o usuário sem conteúdo de segurança.
      return FIRST_AID_GUIDES;
    }
  },

  async getById(id: string): Promise<FirstAidGuide | undefined> {
    try {
      const { data } = await api.get<FirstAidGuide>(`/api/primeiros-socorros/${id}`);
      return data;
    } catch {
      return FIRST_AID_GUIDES.find((g) => g.id === id);
    }
  },

  async search(query: string): Promise<FirstAidGuide[]> {
    try {
      const { data } = await api.get<FirstAidGuide[]>("/api/primeiros-socorros/busca", { params: { query } });
      return data;
    } catch {
      const q = query.toLowerCase();
      return FIRST_AID_GUIDES.filter(
        (g) => g.titulo.toLowerCase().includes(q) || g.resumo.toLowerCase().includes(q)
      );
    }
  },
};
