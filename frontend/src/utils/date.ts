/** Converte "DD/MM/AAAA" ou "DD-MM-AAAA" (formatos que o usuário pode digitar)
 *  para "AAAA-MM-DD" (ISO, esperado pela API). Aceita "/" ou "-" como
 *  separador de propósito — usuários digitam datas com traço com frequência,
 *  e um formato não reconhecido não pode passar adiante sem conversão (isso
 *  já causou um cadastro falhando silenciosamente, virando "Invalid Date"
 *  só descoberto no banco). Retorna null se o valor não for uma data válida,
 *  para quem chama poder validar antes de enviar à API. */
export function brDateToISO(value: string): string | null {
  const match = value.trim().match(/^(\d{2})[/\-](\d{2})[/\-](\d{4})$/);
  if (!match) return null;

  const [, dia, mes, ano] = match;
  const diaNum = Number(dia);
  const mesNum = Number(mes);
  if (mesNum < 1 || mesNum > 12 || diaNum < 1 || diaNum > 31) return null;

  const iso = `${ano}-${mes}-${dia}`;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;

  return iso;
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

/**
 * Formata o texto digitado num campo de data como "DD/MM/AAAA" conforme a
 * pessoa digita, inserindo as barras automaticamente e permitindo só
 * dígitos. Isso elimina na origem o erro que causou um cadastro falhando
 * silenciosamente (usuário digitou "28-09-2008" com traço, formato que a
 * conversão para ISO não reconhecia).
 */
export function maskDateInput(text: string): string {
  const digits = text.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join("/");
}
