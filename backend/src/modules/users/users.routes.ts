import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { hash } from "../../lib/hash";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import { badRequest, notFound, unauthorized } from "../../middleware/errors";
import { toUserProfile } from "./users.mapper";
import {
  pushTokenSchema,
  updateAvatarSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from "./users.validators";

// Rotas de perfil do usuário — seção 21.2 do readme do projeto.
// Todas exigem autenticação.
export const usersRouter = Router();
usersRouter.use(requireAuth);

usersRouter.get(
  "/me",
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) throw notFound("Usuário não encontrado.");
    res.json(toUserProfile(user));
  })
);

usersRouter.put(
  "/me",
  asyncHandler(async (req, res) => {
    const input = updateProfileSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.userId! },
      data: {
        ...input,
        dataNascimento: input.dataNascimento ? new Date(input.dataNascimento) : undefined,
      },
    });
    res.json(toUserProfile(user));
  })
);

usersRouter.patch(
  "/me/avatar",
  asyncHandler(async (req, res) => {
    const { avatarUrl } = updateAvatarSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.userId! }, data: { avatarUrl } });
    res.json(toUserProfile(user));
  })
);

usersRouter.put(
  "/me/password",
  asyncHandler(async (req, res) => {
    const { senhaAtual, novaSenha } = updatePasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) throw notFound("Usuário não encontrado.");

    const senhaOk = await hash.compare(senhaAtual, user.senhaHash);
    if (!senhaOk) throw unauthorized("Senha atual incorreta.");

    await prisma.user.update({
      where: { id: user.id },
      data: { senhaHash: await hash.make(novaSenha) },
    });
    res.json({ message: "Senha alterada com sucesso." });
  })
);

usersRouter.delete(
  "/me",
  asyncHandler(async (req, res) => {
    await prisma.user.delete({ where: { id: req.userId! } });
    res.status(204).send();
  })
);

// Preferências do app — endpoint simples de leitura/escrita livre (JSON
// arbitrário), pensado para configs futuras (tema, notificações etc.) sem
// precisar de migração de banco a cada nova preferência.
usersRouter.get(
  "/me/preferencias",
  asyncHandler(async (req, res) => {
    res.json({});
  })
);

usersRouter.put(
  "/me/preferencias",
  asyncHandler(async (req, res) => {
    if (typeof req.body !== "object" || req.body === null) {
      throw badRequest("Corpo da requisição inválido.");
    }
    res.json(req.body);
  })
);

// Usado por frontend/src/services/notificationService.ts para registrar o
// token de push (Expo Push Token) obtido via expo-notifications no device.
usersRouter.post(
  "/me/push-token",
  asyncHandler(async (req, res) => {
    const { token } = pushTokenSchema.parse(req.body);
    await prisma.pushToken.upsert({
      where: { token },
      update: { userId: req.userId! },
      create: { token, userId: req.userId! },
    });
    res.status(201).json({ message: "Token registrado." });
  })
);
