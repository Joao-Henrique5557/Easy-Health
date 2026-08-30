import { z } from "zod";

export const registerSchema = z.object({
  nome: z.string().min(2, "Informe o nome completo."),
  email: z.string().email("E-mail inválido."),
  telefone: z.string().optional(),
  senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
  dataNascimento: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(1, "Informe a senha."),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken é obrigatório."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido."),
});

export const resetPasswordSchema = z.object({
  codigo: z.string().min(4, "Código inválido."),
  novaSenha: z.string().min(6, "A nova senha precisa ter pelo menos 6 caracteres."),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("E-mail inválido."),
  codigo: z.string().min(4, "Código inválido."),
});
