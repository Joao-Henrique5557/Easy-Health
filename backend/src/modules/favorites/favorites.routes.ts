import { Router } from "express";
import { z } from "zod";
import type { Establishment, EstablishmentPrice, Favorite } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import { toEstablishmentDTO } from "../establishments/establishments.mapper";

type FavoriteWithEstablishment = Favorite & { establishment: Establishment & { precos: EstablishmentPrice[] } };

// Rotas de favoritos — seção 21.8 do readme. Todas exigem autenticação.
export const favoritesRouter = Router();
favoritesRouter.use(requireAuth);

const addFavoriteSchema = z.object({ estabelecimentoId: z.string().min(1) });

favoritesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const favorites: FavoriteWithEstablishment[] = await prisma.favorite.findMany({
      where: { userId: req.userId! },
      include: { establishment: { include: { precos: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(favorites.map((f) => toEstablishmentDTO(f.establishment)));
  })
);

favoritesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { estabelecimentoId } = addFavoriteSchema.parse(req.body);
    await prisma.favorite.upsert({
      where: { userId_establishmentId: { userId: req.userId!, establishmentId: estabelecimentoId } },
      update: {},
      create: { userId: req.userId!, establishmentId: estabelecimentoId },
    });
    res.status(201).json({ message: "Favoritado com sucesso." });
  })
);

// :id aqui é o id do ESTABELECIMENTO, não do registro de favorito — é
// assim que frontend/src/services/favoritesService.ts chama esta rota.
favoritesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.favorite.deleteMany({ where: { userId: req.userId!, establishmentId: req.params.id } });
    res.status(204).send();
  })
);
