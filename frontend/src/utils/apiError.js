/**
 * Extrai a mensagem de erro real que o backend mandou (ver
 * o handler de erros do backend — responde com { error: "..." }.
 *
 * Bug que isso corrige: as telas de auth/perfil estavam usando um
 * catch { Alert.alert("mensagem genérica fixa") } — então quando o
 * cadastro falhava (ex: senha curta, data inválida), a pessoa via só
 * "Verifique os dados e tente novamente", sem nenhuma pista do que
 * realmente estava errado. Isso tornava qualquer bug de validação
 * praticamente impossível de diagnosticar sem printar a tela pra alguém
 * ler o código-fonte.
 *
 * Segunda melhoria: antes, quando o backend estava fora do ar (erro de
 * rede/timeout — sem `error.response` nenhum), essa função caía direto
 * no `fallback` genérico da tela, que é o mesmo texto usado pra qualquer
 * outro erro. Isso fazia parecer que era erro de validação/senha errada,
 * quando na verdade era o servidor inacessível — impossível de
 * diferenciar sem abrir o console. Agora isso é detectado e avisado
 * explicitamente pro usuário.
 */
export function getApiErrorMessage(error, fallback) {
  const axiosError = error;

  // Erro de rede/timeout: a requisição foi feita mas nenhuma resposta
  // voltou (backend fora do ar, sem internet, CORS bloqueado, etc.)
  if (axiosError?.request && !axiosError?.response) {
    if (axiosError.code === "ECONNABORTED") {
      return "O servidor demorou demais para responder. Tente novamente em instantes.";
    }
    return "Não foi possível conectar ao servidor. Verifique sua internet ou tente novamente mais tarde.";
  }
  const status = axiosError?.response?.status;
  const data = axiosError?.response?.data;
  if (data?.issues?.length) {
    return data.issues.map(i => i.message).join("\n");
  }
  if (data?.message || data?.error) {
    return data.message || data.error;
  }
  if (status && status >= 500) {
    return "O servidor encontrou um erro interno. Tente novamente em instantes.";
  }
  return fallback;
}
export const getErrorMessage = getApiErrorMessage;
