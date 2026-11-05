import { FIRST_AID_GUIDES } from "@/data/firstAidContent";
export const firstAidService = {
  async list() {
    return FIRST_AID_GUIDES;
  },
  async getById(id) {
    return FIRST_AID_GUIDES.find(guide => guide.id === id);
  },
  async search(query = "") {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return FIRST_AID_GUIDES.filter(guide =>
      guide.titulo.toLocaleLowerCase("pt-BR").includes(normalizedQuery)
      || guide.resumo.toLocaleLowerCase("pt-BR").includes(normalizedQuery));
  }
};
