import { Router } from "express";
import type { Notification } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth } from "../../middleware/auth";

// Rotas de notificações — seção 21.9 do readme. Todas exigem autenticação.
export const notificationsRouter = Router();
notificationsRouter.use(requireAuth);

/** Classifica a notificação em hoje/ontem/esta semana a partir de `createdAt`
 *  — calculado dinamicamente a cada request, nunca armazenado, para nunca
 *  ficar desatualizado (diferente da versão mock do frontend, que fixava
 *  o grupo como texto). */
function computeGrupo(createdAt: Date): "hoje" | "ontem" | "semana" {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
  const startOfWeek = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);

  if (createdAt >= startOfToday) return "hoje";
  if (createdAt >= startOfYesterday) return "ontem";
  if (createdAt >= startOfWeek) return "semana";
  return "semana";
}

notificationsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: "desc" },
    });
    res.json(
      notifications.map((n: Notification) => ({
        id: n.id,
        grupo: computeGrupo(n.createdAt),
        icon: n.icon,
        titulo: n.titulo,
        descricao: n.descricao,
        lida: n.lida,
      }))
    );
  })
);

notificationsRouter.put(
  "/marcar-todas-lidas",
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({ where: { userId: req.userId! }, data: { lida: true } });
    res.json({ message: "Todas as notificações marcadas como lidas." });
  })
);

notificationsRouter.put(
  "/:id/lida",
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.userId! },
      data: { lida: true },
    });
    res.json({ message: "Notificação marcada como lida." });
  })
);

notificationsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.notification.deleteMany({ where: { id: req.params.id, userId: req.userId! } });
    res.status(204).send();
  })
);
