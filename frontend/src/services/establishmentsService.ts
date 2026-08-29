import { api } from "./api";

export interface Establishment {
  id: string;
  nome: string;
  tipo: "hospital" | "clinica" | "ubs" | "upa" | "laboratorio";
  redeAtendimento: "publico" | "privado";
  distanciaKm: number;
  precoDesde?: string;
  horario: string;
  latitude: number;
  longitude: number;
}

export interface SearchFilters {
  latitude: number;
  longitude: number;
  especialidade?: string;
  tipo?: Establishment["tipo"];
  precoMax?: number;
  raioKm?: number;
}

// O backend combina duas fontes, conforme decidido na pesquisa de APIs:
// - CNES/DATASUS para a rede pública (SUS): dado oficial de estabelecimentos.
// - Google Places API para a rede privada: distância, avaliações, horário real.
// O app nunca chama essas APIs externas diretamente — sempre via /api/estabelecimentos,
// o que mantém as chaves de API protegidas no servidor e permite cachear resultados.
export const establishmentsService = {
  async search(filters: SearchFilters) {
    const { data } = await api.get<Establishment[]>("/api/estabelecimentos/busca", {
      params: filters,
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get<Establishment>(`/api/estabelecimentos/${id}`);
    return data;
  },

  async getPrecos(id: string) {
    const { data } = await api.get(`/api/estabelecimentos/${id}/precos`);
    return data;
  },

  async getHorariosDisponiveis(id: string) {
    const { data } = await api.get(`/api/estabelecimentos/${id}/horarios-disponiveis`);
    return data;
  },
};
