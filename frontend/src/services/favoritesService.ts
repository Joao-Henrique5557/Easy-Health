import { api } from "./api";
import { establishmentsService, Establishment } from "./establishmentsService";

// Estado local simples para favoritos ainda não sincronizados —
// evita perder o toque do usuário caso a chamada à API falhe.
let localFavoriteIds = new Set<string>();

export const favoritesService = {
  async list(): Promise<Establishment[]> {
    try {
      const { data } = await api.get<Establishment[]>("/api/favoritos");
      return data;
    } catch {
      const all = await establishmentsService.search({ latitude: 0, longitude: 0 });
      return all.filter((e) => localFavoriteIds.has(e.id));
    }
  },

  async add(establishmentId: string) {
    localFavoriteIds.add(establishmentId);
    try {
      await api.post("/api/favoritos", { estabelecimentoId: establishmentId });
    } catch {
      // Mantém o estado local mesmo se a sincronização falhar.
    }
  },

  async remove(establishmentId: string) {
    localFavoriteIds.delete(establishmentId);
    try {
      await api.delete(`/api/favoritos/${establishmentId}`);
    } catch {
      // idem
    }
  },

  isFavorite(establishmentId: string) {
    return localFavoriteIds.has(establishmentId);
  },
};
