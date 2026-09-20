import { api } from "./api";
import { ESTABLISHMENTS_MOCK } from "@/data/establishmentsMock";
// O backend combina duas fontes (decidido na pesquisa de APIs do projeto):
// - CNES/DATASUS para a rede pública (SUS).
// - Google Places API para a rede privada (distância, avaliação, horário real).
// O app nunca chama essas APIs externas diretamente — sempre via /api/estabelecimentos,
// o que protege as chaves de API e permite cachear resultados no servidor.
export const establishmentsService = {
  async search(filters) {
    try {
      const {
        data
      } = await api.get("/api/estabelecimentos/busca", {
        params: filters
      });
      return data;
    } catch {
      // Sem backend disponível: usa dados de demonstração (mesmo conteúdo do design)
      // para a tela continuar navegável durante o desenvolvimento/apresentação.
      let results = ESTABLISHMENTS_MOCK;
      if (filters.tipo && filters.tipo !== "todos") {
        results = results.filter(e => e.tipo === filters.tipo);
      }
      if (filters.query) {
        const q = filters.query.toLowerCase();
        results = results.filter(e => e.nome.toLowerCase().includes(q));
      }
      return results;
    }
  },
  async getById(id) {
    try {
      const {
        data
      } = await api.get(`/api/estabelecimentos/${id}`);
      return data;
    } catch {
      return ESTABLISHMENTS_MOCK.find(e => e.id === id);
    }
  },
  async getHorariosDisponiveis(id, data) {
    try {
      const {
        data: horarios
      } = await api.get(`/api/estabelecimentos/${id}/horarios-disponiveis`, {
        params: {
          data
        }
      });
      return horarios;
    } catch {
      return ["08:00", "09:30", "10:00", "11:30", "14:00", "15:30", "16:00"];
    }
  }
};
