import { Router } from "express";
import type { Establishment } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../middleware/asyncHandler";
import { badRequest } from "../../middleware/errors";
import { haversineKm } from "../../lib/geo";

// Rotas de emergência — seção 21.5 do readme.
//
// Decisão de design: estas rotas ficam PÚBLICAS (sem requireAuth), mesmo
// todas as outras exigindo token. Informação de emergência (números de
// socorro, hospital mais próximo) precisa estar acessível mesmo se o
// access token expirou ou algo falhou no login — nunca deve travar atrás
// de autenticação. Mesmo princípio já seguido no frontend
// (emergencyService nunca liga sozinho, só abre o discador).
export const emergencyRouter = Router();

emergencyRouter.get(
  "/contatos",
  asyncHandler(async (_req, res) => {
    res.json([
      { label: "SAMU", numero: "192", descricao: "Emergências de saúde" },
      { label: "Bombeiros", numero: "193", descricao: "Incêndios e resgates" },
      { label: "Polícia", numero: "190", descricao: "Segurança pública" },
    ]);
  })
);

emergencyRouter.get(
  "/hospitais-proximos",
  asyncHandler(async (req, res) => {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      throw badRequest("Informe latitude e longitude válidas.");
    }

    const candidatos = await prisma.establishment.findMany({
      where: { tipo: { in: ["hospital", "upa"] } },
    });

    const hospitais = candidatos
      .map((e: Establishment) => ({
        id: e.id,
        nome: e.nome,
        distanciaKm: Number(haversineKm(latitude, longitude, e.latitude, e.longitude).toFixed(1)),
        endereco: e.endereco,
        aberto24h: e.horario.toLowerCase().includes("24h"),
        latitude: e.latitude,
        longitude: e.longitude,
      }))
      .sort((a: { distanciaKm: number }, b: { distanciaKm: number }) => a.distanciaKm - b.distanciaKm)
      .slice(0, 5);

    res.json(hospitais);
  })
);

emergencyRouter.get(
  "/rotas",
  asyncHandler(async (req, res) => {
    const { estabelecimentoId, latitude, longitude } = req.query;
    const est = await prisma.establishment.findUnique({ where: { id: String(estabelecimentoId) } });
    if (!est) throw badRequest("Estabelecimento não encontrado.");

    const lat = Number(latitude);
    const lng = Number(longitude);
    const distanciaKm = Number.isNaN(lat) || Number.isNaN(lng)
      ? null
      : Number(haversineKm(lat, lng, est.latitude, est.longitude).toFixed(1));

    // Rota real (polyline turn-by-turn) dependeria de uma API de rotas
    // (Google Directions / OSRM) — fora do escopo deste protótipo acadêmico.
    // O app usa Linking (geo:) para abrir o app de mapas do sistema com a
    // rota de verdade; esta rota só informa a distância em linha reta.
    res.json({
      estabelecimento: { id: est.id, nome: est.nome, latitude: est.latitude, longitude: est.longitude },
      distanciaKm,
    });
  })
);
