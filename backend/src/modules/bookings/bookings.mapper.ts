import type { Booking, Establishment } from "@prisma/client";

export function toBookingDTO(booking: Booking & { establishment: Establishment }) {
  return {
    id: booking.id,
    establishmentId: booking.establishmentId,
    establishmentNome: booking.establishment.nome,
    especialidade: booking.especialidade,
    data: booking.data.toISOString().slice(0, 10),
    horario: booking.horario,
    medico: booking.medico,
    medicoCrm: booking.medicoCrm,
    valor: booking.valor,
  };
}
