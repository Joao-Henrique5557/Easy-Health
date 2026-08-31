import { badRequest } from "../middleware/errors";

/**
 * Converte uma string "AAAA-MM-DD" (já validada por regex no Zod) num
 * Date válido, ou lança um erro 400 claro em vez de deixar um
 * `new Date(...)` inválido (ex: "2008-13-45", que bate o formato mas não
 * é uma data real) seguir adiante e quebrar mais tarde na camada do
 * Prisma como um erro 500 sem explicação nenhuma.
 */
export function parseDateOrThrow(value: string, fieldLabel = "Data"): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw badRequest(`${fieldLabel} inválida.`);
  }
  return date;
}
