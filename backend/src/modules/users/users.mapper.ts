import type { User } from "@prisma/client";

// Converte o modelo do Prisma para o shape exato que
// frontend/src/services/profileService.ts (interface UserProfile) espera.
export function toUserProfile(user: User) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    telefone: user.telefone ?? "",
    dataNascimento: user.dataNascimento ? user.dataNascimento.toISOString().slice(0, 10) : "",
    avatarUrl: user.avatarUrl,
    tipoSanguineo: user.tipoSanguineo ?? undefined,
    alergias: user.alergias ?? undefined,
    medicamentosEmUso: user.medicamentosEmUso ?? undefined,
    planoDeSaude: user.planoDeSaude ?? undefined,
    contatoEmergenciaNome: user.contatoEmergenciaNome ?? undefined,
    contatoEmergenciaTelefone: user.contatoEmergenciaTelefone ?? undefined,
    contatoEmergenciaParentesco: user.contatoEmergenciaParentesco ?? undefined,
  };
}
