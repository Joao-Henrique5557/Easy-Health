import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import { authService } from "./auth.service";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.validators";

// Rotas de autenticação — seção 21.1 do readme do projeto.
// Todas são públicas, exceto /logout (precisa saber de quem é a sessão).
export const authRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);
    res.status(201).json(result);
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.json(result);
  })
);

authRouter.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req, res) => {
    await authService.logout(req.userId!);
    res.status(204).send();
  })
);

authRouter.post(
  "/refresh-token",
  asyncHandler(async (req, res) => {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    const tokens = await authService.refresh(refreshToken);
    res.json(tokens);
  })
);

authRouter.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = forgotPasswordSchema.parse(req.body);
    await authService.forgotPassword(email);
    // Sempre 200, mesmo se o e-mail não existir (evita enumeração de contas).
    res.json({ message: "Se o e-mail existir, um código de recuperação foi enviado." });
  })
);

authRouter.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { codigo, novaSenha } = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(codigo, novaSenha);
    res.json({ message: "Senha redefinida com sucesso." });
  })
);

authRouter.post(
  "/verify-email",
  asyncHandler(async (req, res) => {
    const { email, codigo } = verifyEmailSchema.parse(req.body);
    await authService.verifyEmail(email, codigo);
    res.json({ message: "E-mail verificado com sucesso." });
  })
);
