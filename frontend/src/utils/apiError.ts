import { AxiosError } from "axios";

/**
 * Extrai a mensagem de erro real que o backend mandou (ver
 * backend/src/middleware/errorHandler.ts — sempre responde com
 * { message: "..." }, e erros de validação Zod incluem também "issues").
 *
 * Bug que isso corrige: as telas de auth/perfil estavam usando um
 * catch { Alert.alert("mensagem genérica fixa") } — então quando o
 * cadastro falhava (ex: senha curta, data inválida), a pessoa via só
 * "Verifique os dados e tente novamente", sem nenhuma pista do que
 * realmente estava errado. Isso tornava qualquer bug de validação
 * praticamente impossível de diagnosticar sem printar a tela pra alguém
 * ler o código-fonte.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ message?: string; issues?: { path: string; message: string }[] }>;
  const data = axiosError?.response?.data;

  if (data?.issues?.length) {
    return data.issues.map((i) => i.message).join("\n");
  }
  if (data?.message) {
    return data.message;
  }
  return fallback;
}
