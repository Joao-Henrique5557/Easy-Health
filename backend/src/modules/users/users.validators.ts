import { z } from "zod";

export const updateProfileSchema = z.object({
  nome: z.string().min(2).optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  dataNascimento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento deve estar no formato AAAA-MM-DD.")
    .optional(),
  tipoSanguineo: z.string().optional(),
  alergias: z.string().optional(),
  medicamentosEmUso: z.string().optional(),
  planoDeSaude: z.string().optional(),
  contatoEmergenciaNome: z.string().optional(),
  contatoEmergenciaTelefone: z.string().optional(),
  contatoEmergenciaParentesco: z.string().optional(),
});

export const updatePasswordSchema = z.object({
  senhaAtual: z.string().min(1),
  novaSenha: z.string().min(6),
});

export const updateAvatarSchema = z.object({
  avatarUrl: z.string().url(),
});

export const pushTokenSchema = z.object({
  token: z.string().min(1),
});
