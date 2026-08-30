import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import { forbidden, notFound } from "../../middleware/errors";
import { toBookingDTO } from "./bookings.mapper";
import { createBookingSchema, updateBookingSchema } from "./bookings.validators";

// Rotas de agendamento — seção 21.6 do readme. Todas exigem autenticação
// (agendamentos pertencem a um usuário).
export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);

const DEFAULT_DOCTOR = { medico: "Dr. Carlos Mendes", medicoCrm: "CRM 12345" };

bookingsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.userId!, data: { gte: new Date(new Date().toDateString()) } },
      include: { establishment: true },
      orderBy: { data: "asc" },
    });
    res.json(bookings.map(toBookingDTO));
  })
);

bookingsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createBookingSchema.parse(req.body);
    const establishment = await prisma.establishment.findUnique({
      where: { id: input.establishmentId },
      include: { precos: true },
    });
    if (!establishment) throw notFound("Estabelecimento não encontrado.");

    const precoMatch =
      establishment.precos.find((p: { servico: string; valor: string }) => p.servico.toLowerCase().includes("especialista")) ??
      establishment.precos[0];

    const booking = await prisma.booking.create({
      data: {
        userId: req.userId!,
        establishmentId: input.establishmentId,
        especialidade: input.especialidade,
        data: new Date(input.data),
        horario: input.horario,
        medico: DEFAULT_DOCTOR.medico,
        medicoCrm: DEFAULT_DOCTOR.medicoCrm,
        valor: precoMatch?.valor ?? "A combinar",
      },
      include: { establishment: true },
    });

    res.status(201).json(toBookingDTO(booking));
  })
);

async function findOwnedBooking(userId: string, id: string) {
  const booking = await prisma.booking.findUnique({ where: { id }, include: { establishment: true } });
  if (!booking) throw notFound("Agendamento não encontrado.");
  if (booking.userId !== userId) throw forbidden();
  return booking;
}

bookingsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const booking = await findOwnedBooking(req.userId!, req.params.id);
    res.json(toBookingDTO(booking));
  })
);

bookingsRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    await findOwnedBooking(req.userId!, req.params.id);
    const input = updateBookingSchema.parse(req.body);
    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { ...input, data: input.data ? new Date(input.data) : undefined },
      include: { establishment: true },
    });
    res.json(toBookingDTO(updated));
  })
);

bookingsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await findOwnedBooking(req.userId!, req.params.id);
    await prisma.booking.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

bookingsRouter.post(
  "/:id/confirmar",
  asyncHandler(async (req, res) => {
    await findOwnedBooking(req.userId!, req.params.id);
    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: "confirmada" },
      include: { establishment: true },
    });
    res.json(toBookingDTO(updated));
  })
);
