import type { Consultation, Prescription } from "@prisma/client";

export function toConsultationDTO(c: Consultation & { prescricoes: Prescription[] }) {
  return {
    id: c.id,
    tipo: "consulta" as const,
    medico: c.medico,
    especialidade: c.especialidade,
    local: c.local,
    data: c.data.toISOString().slice(0, 10),
    status: c.status,
    diagnostico: c.diagnostico ?? undefined,
    observacoes: c.observacoes ?? undefined,
    prescricoes: c.prescricoes.length
      ? c.prescricoes.map((p: Prescription) => ({ medicamento: p.medicamento, posologia: p.posologia }))
      : undefined,
    retorno: c.retorno ?? undefined,
  };
}
