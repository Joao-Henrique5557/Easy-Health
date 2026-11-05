import {
  createEventAsync,
  getDefaultCalendarAsync,
  requestCalendarPermissionsAsync
} from "expo-calendar/legacy";
import { Platform } from "react-native";

function escapeCalendarText(value = "") {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function createIcs(booking) {
  const startDate = new Date(`${booking.data}T${booking.horario}:00-03:00`);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
  const formatUtc = date => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const summary = escapeCalendarText(`Consulta - ${booking.especialidade}`);
  const location = escapeCalendarText(booking.establishmentNome);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Easy Health//Consulta//PT-BR",
    "BEGIN:VEVENT",
    `UID:${booking.id}@easy-health`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(startDate)}`,
    `DTEND:${formatUtc(endDate)}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

function downloadIcs(booking) {
  const blob = new Blob([createIcs(booking)], {
    type: "text/calendar;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `consulta-${booking.id}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const calendarService = {
  async addBooking(booking) {
    if (Platform.OS === "web") {
      downloadIcs(booking);
      return;
    }

    const permission = await requestCalendarPermissionsAsync();
    if (permission.status !== "granted") {
      throw new Error("Permissão para acessar o calendário não concedida.");
    }
    const calendar = await getDefaultCalendarAsync();
    if (!calendar) {
      throw new Error("Nenhum calendário disponível no dispositivo.");
    }
    const startDate = new Date(`${booking.data}T${booking.horario}:00-03:00`);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
    await createEventAsync(calendar.id, {
      title: `Consulta - ${booking.especialidade}`,
      location: booking.establishmentNome,
      notes: "Agendamento registrado no Easy Health.",
      startDate,
      endDate,
      timeZone: "America/Sao_Paulo"
    });
  }
};
