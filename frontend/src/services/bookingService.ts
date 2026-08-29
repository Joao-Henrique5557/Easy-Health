import { api } from "./api";

export interface Booking {
  id: string;
  establishmentId: string;
  establishmentNome: string;
  especialidade: string;
  data: string; // ISO
  horario: string;
  medico: string;
  medicoCrm: string;
  valor: string;
}

export interface CreateBookingPayload {
  establishmentId: string;
  especialidade: string;
  data: string;
  horario: string;
}

// Dados de demonstração — mesmo médico/valor do design (Hospital São Lucas).
const DOCTOR_MOCK = { nome: "Dr. Carlos Mendes", crm: "CRM 12345", valor: "R$ 280" };

export const bookingService = {
  async create(payload: CreateBookingPayload): Promise<Booking> {
    try {
      const { data } = await api.post<Booking>("/api/agendamentos", payload);
      return data;
    } catch {
      return {
        id: `booking-demo-${Date.now()}`,
        establishmentId: payload.establishmentId,
        establishmentNome: "Hospital São Lucas",
        especialidade: payload.especialidade,
        data: payload.data,
        horario: payload.horario,
        medico: DOCTOR_MOCK.nome,
        medicoCrm: DOCTOR_MOCK.crm,
        valor: DOCTOR_MOCK.valor,
      };
    }
  },

  async listUpcoming(): Promise<Booking[]> {
    try {
      const { data } = await api.get<Booking[]>("/api/agendamentos");
      return data;
    } catch {
      return [
        {
          id: "booking-demo-1",
          establishmentId: "hosp-sao-lucas",
          establishmentNome: "Hospital Albert Einstein",
          especialidade: "Cardiologista",
          data: "2026-10-24",
          horario: "14:00",
          medico: "Dr. Bruno Carvalho",
          medicoCrm: "CRM 54321",
          valor: "R$ 280",
        },
      ];
    }
  },
};
