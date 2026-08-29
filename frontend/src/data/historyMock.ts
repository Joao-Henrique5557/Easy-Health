export interface Prescricao {
  medicamento: string;
  posologia: string;
}

export interface ConsultaHistoricoMock {
  id: string;
  tipo: "consulta";
  medico: string;
  especialidade: string;
  local: string;
  data: string; // ISO
  status: "realizada" | "agendada";
  diagnostico?: string;
  observacoes?: string;
  prescricoes?: Prescricao[];
  retorno?: string;
}

// Mesmos registros do design, para o Histórico e o Detalhe da Consulta
// renderizarem igual ao protótipo mesmo sem backend.
export const HISTORY_MOCK: ConsultaHistoricoMock[] = [
  {
    id: "consulta-1",
    tipo: "consulta",
    medico: "Dr. Carlos Mendes",
    especialidade: "Cardiologista",
    local: "Hospital São Lucas",
    data: "2025-10-10",
    status: "realizada",
  },
  {
    id: "consulta-2",
    tipo: "consulta",
    medico: "Dra. Ana Souza",
    especialidade: "Clínica Geral",
    local: "UBS Vila Mariana",
    data: "2025-08-20",
    status: "realizada",
    diagnostico: "Infecção respiratória leve",
    observacoes: "Sintomas de coriza, tosse seca leve e febre baixa controlada. Repouso sugerido.",
    prescricoes: [
      { medicamento: "Amoxicilina 500mg", posologia: "Tomar de 8 em 8 horas por 7 dias" },
      { medicamento: "Dipirona 500mg", posologia: "Tomar de 6 em 6 horas se houver febre" },
    ],
    retorno: "Agendar retorno em 15 dias",
  },
  {
    id: "consulta-3",
    tipo: "consulta",
    medico: "Dr. Marcos Lima",
    especialidade: "Ortopedista",
    local: "Hospital Santa Casa",
    data: "2025-03-15",
    status: "realizada",
  },
];
