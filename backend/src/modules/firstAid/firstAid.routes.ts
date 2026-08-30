import { Router } from "express";
import type { FirstAidGuide } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../middleware/asyncHandler";
import { notFound } from "../../middleware/errors";

// Rotas de primeiros socorros — seção 21.3 do readme. Conteúdo público
// (não exige autenticação): é informação de segurança que deve estar
// acessível mesmo antes do login, inclusive no Modo Emergência.
export const firstAidRouter = Router();

firstAidRouter.get(
  "/categorias",
  asyncHandler(async (_req, res) => {
    const guides = await prisma.firstAidGuide.findMany({ select: { id: true, titulo: true, icon: true } });
    res.json(guides);
  })
);

firstAidRouter.get(
  "/busca",
  asyncHandler(async (req, res) => {
    const query = String(req.query.query ?? "").toLowerCase();
    const guides = await prisma.firstAidGuide.findMany({ orderBy: { ordem: "asc" } });
    const filtered = query
      ? guides.filter((g: FirstAidGuide) => g.titulo.toLowerCase().includes(query) || g.resumo.toLowerCase().includes(query))
      : guides;
    res.json(filtered);
  })
);

firstAidRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const guide = await prisma.firstAidGuide.findUnique({ where: { id: req.params.id } });
    if (!guide) throw notFound("Guia de primeiros socorros não encontrado.");
    res.json(guide);
  })
);

firstAidRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const guides = await prisma.firstAidGuide.findMany({ orderBy: { ordem: "asc" } });
    res.json(guides);
  })
);
