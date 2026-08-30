import { Router } from "express";
import type { Establishment, EstablishmentPrice } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../middleware/asyncHandler";
import { notFound } from "../../middleware/errors";
import { toEstablishmentDTO } from "./establishments.mapper";

type EstablishmentDTO = ReturnType<typeof toEstablishmentDTO>;
type EstablishmentWithPrecos = Establishment & { precos: EstablishmentPrice[] };

// Rotas de estabelecimentos de saúde — seção 21.4 do readme. Conteúdo
// público (equivalente a uma busca no Google Maps) — não exige autenticação.
//
// Conforme decidido na pesquisa de APIs do projeto: em produção, esta
// camada agregaria CNES/DATASUS (rede pública) e Google Places (rede
// privada) e cachearia os resultados aqui. Por ora, os dados vêm do banco
// (populados pelo seed com o mesmo conteúdo do design), o que já cobre o
// contrato completo da API para o frontend.
export const establishmentsRouter = Router();

establishmentsRouter.get(
  "/busca",
  asyncHandler(async (req, res) => {
    const { latitude, longitude, tipo, query, raioKm } = req.query;
    const lat = latitude ? Number(latitude) : undefined;
    const lng = longitude ? Number(longitude) : undefined;

    const where: any = {};
    if (tipo && tipo !== "todos") where.tipo = String(tipo);
    if (query) where.nome = { contains: String(query), mode: "insensitive" };

    const establishments: EstablishmentWithPrecos[] = await prisma.establishment.findMany({
      where,
      include: { precos: true },
    });

    const coords = lat !== undefined && lng !== undefined && !Number.isNaN(lat) && !Number.isNaN(lng)
      ? { latitude: lat, longitude: lng }
      : undefined;

    let results: EstablishmentDTO[] = establishments.map((e) => toEstablishmentDTO(e, coords));

    if (raioKm && coords) {
      const raio = Number(raioKm);
      results = results.filter((e) => e.distanciaKm <= raio);
    }

    if (coords) results.sort((a, b) => a.distanciaKm - b.distanciaKm);

    res.json(results);
  })
);

establishmentsRouter.get(
  "/:id/especialidades",
  asyncHandler(async (req, res) => {
    const est = await prisma.establishment.findUnique({ where: { id: req.params.id } });
    if (!est) throw notFound("Estabelecimento não encontrado.");
    res.json(est.especialidades);
  })
);

establishmentsRouter.get(
  "/:id/precos",
  asyncHandler(async (req, res) => {
    const precos: EstablishmentPrice[] = await prisma.establishmentPrice.findMany({
      where: { establishmentId: req.params.id },
    });
    res.json(precos.map((p) => ({ servico: p.servico, valor: p.valor })));
  })
);

const BASE_SLOTS = ["08:00", "09:30", "10:00", "11:30", "14:00", "15:30", "16:00"];

establishmentsRouter.get(
  "/:id/horarios-disponiveis",
  asyncHandler(async (req, res) => {
    const dataStr = String(req.query.data ?? "");
    const data = dataStr ? new Date(dataStr) : new Date();
    const startOfDay = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Remove da lista base os horários já reservados nesse dia — ligação
    // real com o módulo de agendamentos, não só um mock estático.
    const bookedSlots: { horario: string }[] = await prisma.booking.findMany({
      where: { establishmentId: req.params.id, data: { gte: startOfDay, lt: endOfDay } },
      select: { horario: true },
    });
    const bookedSet = new Set(bookedSlots.map((b) => b.horario));

    res.json(BASE_SLOTS.filter((slot) => !bookedSet.has(slot)));
  })
);

establishmentsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const est: EstablishmentWithPrecos | null = await prisma.establishment.findUnique({
      where: { id: req.params.id },
      include: { precos: true },
    });
    if (!est) throw notFound("Estabelecimento não encontrado.");
    res.json(toEstablishmentDTO(est));
  })
);

establishmentsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const establishments: EstablishmentWithPrecos[] = await prisma.establishment.findMany({
      include: { precos: true },
    });
    res.json(establishments.map((e) => toEstablishmentDTO(e)));
  })
);

// GET /api/especialidades — lista geral de especialidades (seção 21.4),
// montada dinamicamente a partir do que existe cadastrado.
export const specialtiesRouter = Router();
specialtiesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const establishments: { especialidades: string[] }[] = await prisma.establishment.findMany({
      select: { especialidades: true },
    });
    const unique = Array.from(new Set(establishments.flatMap((e) => e.especialidades))).sort();
    res.json(unique);
  })
);
