import type { Establishment, EstablishmentPrice } from "@prisma/client";
import { haversineKm } from "../../lib/geo";

type EstablishmentWithPrecos = Establishment & { precos: EstablishmentPrice[] };

// Converte o modelo do Prisma para o shape exato que
// frontend/src/services/establishmentsService.ts (interface Establishment) espera.
export function toEstablishmentDTO(
  est: EstablishmentWithPrecos,
  userCoords?: { latitude: number; longitude: number }
) {
  const distanciaKm = userCoords
    ? haversineKm(userCoords.latitude, userCoords.longitude, est.latitude, est.longitude)
    : 0;

  return {
    id: est.id,
    nome: est.nome,
    tipo: est.tipo,
    redeAtendimento: est.redeAtendimento,
    distanciaKm: Number(distanciaKm.toFixed(1)),
    endereco: est.endereco,
    avaliacao: est.avaliacao,
    avaliacoesCount: est.avaliacoesCount ?? undefined,
    status: est.status,
    statusLabel: est.statusLabel ?? undefined,
    horario: est.horario,
    telefone: est.telefone ?? undefined,
    especialidades: est.especialidades.length ? est.especialidades : undefined,
    precos: est.precos.length
      ? est.precos.map((p: EstablishmentPrice) => ({ servico: p.servico, valor: p.valor }))
      : undefined,
    convenios: est.convenios.length ? est.convenios : undefined,
    latitude: est.latitude,
    longitude: est.longitude,
  };
}
