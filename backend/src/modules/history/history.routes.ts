import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import { forbidden, notFound } from "../../middleware/errors";
import { toConsultationDTO } from "./history.mapper";
import { createConsultationSchema } from "./history.validators";

// Rotas de histórico de saúde — seção 21.7 do readme. Todas exigem
// autenticação (histórico é sempre do próprio usuário).
export const historyRouter = Router();
historyRouter.use(requireAuth);

historyRouter.get(
  "/consultas",
  asyncHandler(async (req, res) => {
    const consultas = await prisma.consultation.findMany({
      where: { userId: req.userId! },
      include: { prescricoes: true },
      orderBy: { data: "desc" },
    });
    res.json(consultas.map(toConsultationDTO));
  })
);

historyRouter.post(
  "/consultas",
  asyncHandler(async (req, res) => {
    const input = createConsultationSchema.parse(req.body);
    const consulta = await prisma.consultation.create({
      data: {
        userId: req.userId!,
        medico: input.medico,
        especialidade: input.especialidade,
        local: input.local,
        data: new Date(input.data),
        status: input.status,
        diagnostico: input.diagnostico,
        observacoes: input.observacoes,
        retorno: input.retorno,
        prescricoes: input.prescricoes ? { create: input.prescricoes } : undefined,
      },
      include: { prescricoes: true },
    });
    res.status(201).json(toConsultationDTO(consulta));
  })
);

historyRouter.get(
  "/consultas/:id",
  asyncHandler(async (req, res) => {
    const consulta = await prisma.consultation.findUnique({
      where: { id: req.params.id },
      include: { prescricoes: true },
    });
    if (!consulta) throw notFound("Consulta não encontrada.");
    if (consulta.userId !== req.userId) throw forbidden();
    res.json(toConsultationDTO(consulta));
  })
);

// Exames, vacinas, medicamentos e documentos médicos são "Prioridade
// futura" no roadmap do readme (seção 15/16) — ainda não têm tabela
// própria. As rotas já existem (documentadas na seção 21.7) e respondem
// com listas vazias em vez de 404, para o frontend continuar funcionando
// normalmente (ver fallback em frontend/src/services/historyService.ts).
historyRouter.get("/exames", asyncHandler(async (_req, res) => res.json([])));
historyRouter.get("/exames/:id", asyncHandler(async (_req, res) => res.status(404).json({ message: "Ainda não implementado." })));
historyRouter.post("/exames", asyncHandler(async (_req, res) => res.status(501).json({ message: "Ainda não implementado nesta fase do MVP." })));
historyRouter.get("/vacinas", asyncHandler(async (_req, res) => res.json([])));
historyRouter.get("/medicamentos", asyncHandler(async (_req, res) => res.json([])));
historyRouter.get("/documentos", asyncHandler(async (_req, res) => res.json([])));
historyRouter.post("/documentos", asyncHandler(async (_req, res) => res.status(501).json({ message: "Ainda não implementado nesta fase do MVP." })));
historyRouter.delete("/documentos/:id", asyncHandler(async (_req, res) => res.status(404).json({ message: "Documento não encontrado." })));
