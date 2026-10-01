import { api } from "./api";
/**
 * IMPORTANTE: este serviço NUNCA chama api.anthropic.com diretamente.
 * A rota do backend (POST /api/assistant/message) responde com regras
 * demonstrativas e não chama um provedor de IA. Uma futura chave deve ficar
 * apenas no servidor, nunca embutida no aplicativo.
 *
 * Contrato da rota no backend:
 *   POST /api/assistant/message
 *   body: { message: string, history: AssistantMessage[] }
 *   resposta: { reply: string, screen: AssistantScreen }
 *
 * O backend deve reaplicar lá as mesmas regras do prompt de sistema:
 * nunca diagnosticar, nunca prescrever, nunca dizer que "vai ligar" —
 * só orientar o usuário a agir.
 */
export const assistantService = {
  async sendMessage(message, history) {
    const {
      data
    } = await api.post("/api/assistant/message", {
      message,
      history
    });
    const raw = data;
    return {
      reply: typeof raw.reply === "string" ? raw.reply : typeof raw.message === "string" ? raw.message : "Não consegui responder agora. Use o menu para continuar.",
      screen: ["home", "primeiros_socorros", "busca_atendimento", "historico", "perfil", "emergencia"].includes(raw.screen) ? raw.screen : null
    };
  }
};
