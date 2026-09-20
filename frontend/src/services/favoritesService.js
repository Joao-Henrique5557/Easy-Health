import { api } from "./api";
import { establishmentsService } from "./establishmentsService";

// Estado local simples para favoritos ainda não sincronizados —
// evita perder o toque do usuário caso a chamada à API falhe.
let localFavoriteIds = new Set();
export const favoritesService = {
  async list() {
    try {
      const {
        data
      } = await api.get("/api/favoritos");
      return data;
    } catch {
      const all = await establishmentsService.search({
        latitude: 0,
        longitude: 0
      });
      return all.filter(e => localFavoriteIds.has(e.id));
    }
  },
  async add(establishmentId) {
    localFavoriteIds.add(establishmentId);
    try {
      await api.post("/api/favoritos", {
        estabelecimentoId: establishmentId
      });
    } catch {
      // Mantém o estado local mesmo se a sincronização falhar.
    }
  },
  async remove(establishmentId) {
    localFavoriteIds.delete(establishmentId);
    try {
      await api.delete(`/api/favoritos/${establishmentId}`);
    } catch {
      // idem
    }
  },
  isFavorite(establishmentId) {
    return localFavoriteIds.has(establishmentId);
  }
};
