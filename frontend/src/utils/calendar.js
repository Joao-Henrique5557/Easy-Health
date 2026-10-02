import { formatLocalDateISO } from "./date";

const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
export function getWeekdayLabels() {
  return WEEKDAY_LABELS;
}
export function getMonthLabel(reference) {
  return reference.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric"
  });
}

/** Gera a grade de um mês (semanas completas, incluindo dias do mês anterior/seguinte para preencher). */
export function getMonthGrid(reference) {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const start = new Date(year, month, 1 - startWeekday);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push({
      date,
      iso: formatLocalDateISO(date),
      day: date.getDate(),
      inCurrentMonth: date.getMonth() === month
    });
  }
  return days;
}
