import { api } from "./api";

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string; // ISO
  avatarUrl?: string | null;
  // Campos da "Ficha Médica" (tela de Emergência e Editar Perfil).
  // Extensão do contrato original de /api/users/me (seção 21.2 do readme)
  // — o backend deve adicionar essas colunas à tabela de usuários.
  tipoSanguineo?: string;
  alergias?: string;
  medicamentosEmUso?: string;
  planoDeSaude?: string;
  contatoEmergenciaNome?: string;
  contatoEmergenciaTelefone?: string;
  contatoEmergenciaParentesco?: string;
}

// Perfil de demonstração (mesmo usado no design) — usado como fallback
// enquanto o backend não está disponível, para todas as telas que dependem
// de dados do usuário (Home, Emergência, Editar Perfil) ficarem navegáveis.
const PROFILE_MOCK: UserProfile = {
  id: "demo-user",
  nome: "Maria Silva",
  email: "maria.silva@email.com",
  telefone: "(11) 99999-9999",
  dataNascimento: "1990-08-14",
  avatarUrl: null,
  tipoSanguineo: "O-",
  alergias: "Penicilina, Corantes Amarelos",
  medicamentosEmUso: "Nenhum",
  planoDeSaude: "Amil Saúde (Nacional)",
  contatoEmergenciaNome: "José Silva",
  contatoEmergenciaParentesco: "Esposo",
  contatoEmergenciaTelefone: "(11) 98888-8888",
};

function calcularIdade(dataNascimentoISO: string): number {
  const nascimento = new Date(dataNascimentoISO);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) idade -= 1;
  return idade;
}

export const profileService = {
  async getMe(): Promise<UserProfile> {
    try {
      const { data } = await api.get<UserProfile>("/api/users/me");
      return data;
    } catch {
      return PROFILE_MOCK;
    }
  },

  async updateMe(payload: Partial<UserProfile>): Promise<UserProfile> {
    const { data } = await api.put<UserProfile>("/api/users/me", payload);
    return data;
  },

  /**
   * O backend (`backend/src/modules/users/users.routes.ts`) espera
   * { avatarUrl: string } — é `z.string().url()`, não um upload
   * multipart de verdade (não há storage de arquivo no backend ainda).
   * Por isso mandamos a foto como data URI (base64), que passa na
   * validação de URL. Funciona para o MVP acadêmico, mas não é o ideal
   * para produção: cada foto vira uma string grande guardada direto na
   * coluna do banco. Quando o backend tiver um endpoint de upload real
   * (multer + storage em disco/S3/Cloudinary), troque isso por enviar o
   * arquivo e receber de volta uma URL curta.
   */
  async updateAvatar(dataUri: string): Promise<UserProfile> {
    const { data } = await api.patch<UserProfile>("/api/users/me/avatar", { avatarUrl: dataUri });
    return data;
  },

  calcularIdade,
};
