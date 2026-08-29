import { api } from "./api";
import { ESTABLISHMENTS_MOCK } from "@/data/establishmentsMock";

export interface EstablishmentPreco {
  servico: string;
  valor: string;
}

export interface Establishment {
  id: string;
  nome: string;
  tipo: "hospital" | "clinica" | "ubs" | "upa" | "laboratorio";
  redeAtendimento: "publico" | "privado";
  distanciaKm: number;
  endereco: string;
  avaliacao: number;
  avaliacoesCount?: number;
  status: "aberto" | "fechado" | "emergencia";
  statusLabel?: string;
  horario: string;
  telefone?: string;
  especialidades?: string[];
  precos?: EstablishmentPreco[];
  convenios?: string[];
  latitude: number;
  longitude: number;
  favorito?: boolean;
}

export interface SearchFilters {
  latitude: number;
  longitude: number;
  tipo?: Establishment["tipo"] | "todos";
  query?: string;
  raioKm?: number;
}

// O backend combina duas fontes (decidido na pesquisa de APIs do projeto):
// - CNES/DATASUS para a rede pública (SUS).
// - Google Places API para a rede privada (distância, avaliação, horário real).
// O app nunca chama essas APIs externas diretamente — sempre via /api/estabelecimentos,
// o que protege as chaves de API e permite cachear resultados no servidor.
export const establishmentsService = {
  async search(filters: SearchFilters): Promise<Establishment[]> {
    try {
      const { data } = await api.get<Establishment[]>("/api/estabelecimentos/busca", { params: filters });
      return data;
    } catch {
      // Sem backend disponível: usa dados de demonstração (mesmo conteúdo do design)
      // para a tela continuar navegável durante o desenvolvimento/apresentação.
      let results = ESTABLISHMENTS_MOCK;
      if (filters.tipo && filters.tipo !== "todos") {
        results = results.filter((e) => e.tipo === filters.tipo);
      }
      if (filters.query) {
        const q = filters.query.toLowerCase();
        results = results.filter((e) => e.nome.toLowerCase().includes(q));
      }
      return results;
    }
  },

  async getById(id: string): Promise<Establishment | undefined> {
    try {
      const { data } = await api.get<Establishment>(`/api/estabelecimentos/${id}`);
      return data;
    } catch {
      return ESTABLISHMENTS_MOCK.find((e) => e.id === id);
    }
  },

  async getHorariosDisponiveis(id: string, data: string): Promise<string[]> {
    try {
      const { data: horarios } = await api.get<string[]>(`/api/estabelecimentos/${id}/horarios-disponiveis`, {
        params: { data },
      });
      return horarios;
    } catch {
      return ["08:00", "09:30", "10:00", "11:30", "14:00", "15:30", "16:00"];
    }
  },
};
