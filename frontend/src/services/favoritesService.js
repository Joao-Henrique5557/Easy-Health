import { api } from "./api";
let localFavoriteIds = new Set();
export const favoritesService = {
  async list() {
    const { data } = await api.get("/api/favoritos");
    localFavoriteIds = new Set(data.map(establishment => establishment.id));
    return data;
  },
  async add(establishmentId) {
    const { data } = await api.post("/api/favoritos", {
      estabelecimentoId: establishmentId
    });
    localFavoriteIds = new Set(data.map(establishment => establishment.id));
  },
  async remove(establishmentId) {
    const { data } = await api.delete(`/api/favoritos/${establishmentId}`);
    localFavoriteIds = new Set(data.map(establishment => establishment.id));
  },
  isFavorite(establishmentId) {
    return localFavoriteIds.has(establishmentId);
  }
};
