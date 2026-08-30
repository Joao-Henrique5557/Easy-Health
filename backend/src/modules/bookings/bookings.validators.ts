import { z } from "zod";

export const createBookingSchema = z.object({
  establishmentId: z.string().min(1),
  especialidade: z.string().min(1),
  data: z.string().min(1),
  horario: z.string().min(1),
});

export const updateBookingSchema = z.object({
  data: z.string().min(1).optional(),
  horario: z.string().min(1).optional(),
});
