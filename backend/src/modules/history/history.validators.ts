import { z } from "zod";

export const createConsultationSchema = z.object({
  medico: z.string().min(1),
  especialidade: z.string().min(1),
  local: z.string().min(1),
  data: z.string().min(1),
  status: z.enum(["realizada", "agendada"]).default("realizada"),
  diagnostico: z.string().optional(),
  observacoes: z.string().optional(),
  retorno: z.string().optional(),
  prescricoes: z.array(z.object({ medicamento: z.string(), posologia: z.string() })).optional(),
});
