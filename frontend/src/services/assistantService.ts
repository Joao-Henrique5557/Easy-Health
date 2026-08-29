import { api } from "./api";

export type AssistantScreen =
  | "home"
  | "primeiros_socorros"
  | "busca_atendimento"
  | "historico"
  | "perfil"
  | "emergencia"
  | null;

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantResponse {
  reply: string;
  screen: AssistantScreen;
}

/**
 * IMPORTANTE: este serviço NUNCA chama api.anthropic.com diretamente.
 * A chave da API da Claude fica só no backend (rota nova, ainda não
 * listada no readme: POST /api/assistant/message). Chamar a API de IA
 * direto do celular exigiria embutir a chave no app — qualquer pessoa
 * poderia extraí-la do APK e usá-la às custas de vocês.
 *
 * Contrato sugerido da rota no backend:
 *   POST /api/assistant/message
 *   body: { message: string, history: AssistantMessage[] }
 *   resposta: { reply: string, screen: AssistantScreen }
 *
 * O backend deve reaplicar lá as mesmas regras do prompt de sistema:
 * nunca diagnosticar, nunca prescrever, nunca dizer que "vai ligar" —
 * só orientar o usuário a agir.
 */
export const assistantService = {
  async sendMessage(message: string, history: AssistantMessage[]): Promise<AssistantResponse> {
    const { data } = await api.post<AssistantResponse>("/api/assistant/message", {
      message,
      history,
    });
    return data;
  },
};
