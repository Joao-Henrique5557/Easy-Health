/** Converte "DD/MM/AAAA" (formato exibido no formulário) para "AAAA-MM-DD" (ISO, esperado pela API). */
export function brDateToISO(value: string): string {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return value; // deixa a validação de formato para o backend/campo
  const [, dia, mes, ano] = match;
  return `${ano}-${mes}-${dia}`;
}

/** Converte "AAAA-MM-DD" para "DD/MM/AAAA", para exibir em campos de formulário. */
export function isoDateToBR(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  const [, ano, mes, dia] = match;
  return `${dia}/${mes}/${ano}`;
}

export function formatDateLong(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

export function formatDateShort(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
