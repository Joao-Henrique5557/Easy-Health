export interface NotificationItem {
  id: string;
  grupo: "hoje" | "ontem" | "semana";
  icon: "calendar" | "medkit" | "information-circle" | "checkmark-circle";
  titulo: string;
  descricao: string;
  lida: boolean;
}

export const NOTIFICATIONS_MOCK: NotificationItem[] = [
  {
    id: "n1",
    grupo: "hoje",
    icon: "calendar",
    titulo: "Consulta amanhã às 10:00",
    descricao: "Dr. Carlos Mendes — Cardiologista",
    lida: false,
  },
  {
    id: "n2",
    grupo: "hoje",
    icon: "medkit",
    titulo: "Hora do medicamento",
    descricao: "Hora de tomar Amoxicilina 500mg",
    lida: false,
  },
  {
    id: "n3",
    grupo: "ontem",
    icon: "information-circle",
    titulo: "Dica de Saúde",
    descricao: "Dica: mantenha sua carteira de vacinação atualizada.",
    lida: true,
  },
  {
    id: "n4",
    grupo: "semana",
    icon: "checkmark-circle",
    titulo: "Agendamento Confirmado",
    descricao: "Sua consulta foi agendada para 15 de Setembro.",
    lida: true,
  },
];
