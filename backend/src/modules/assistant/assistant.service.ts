import { env } from "../../env";

const SYSTEM_PROMPT = `Você é o assistente de navegação do app de saúde "Easy Health".
Você conhece estas telas do app:
- home: tela inicial com atalhos
- primeiros_socorros: guias educativos de primeiros socorros
- busca_atendimento: busca de hospitais, clínicas e UBS próximos, com preço e distância
- historico: histórico de consultas e exames do usuário
- perfil: dados cadastrais do usuário
- emergencia: tela de emergência com números reais de socorro (192 SAMU, 193 Bombeiros, 190 Polícia) e primeiros socorros rápidos

Responda SEMPRE e SOMENTE com um JSON válido, sem crases, sem markdown e sem texto fora do JSON, no formato exato:
{"reply": "resposta curta, amigável e em português do Brasil", "screen": "um dos ids de tela acima, ou null se não for necessário navegar"}

Regras importantes:
- Nunca dê diagnóstico médico, prescrição ou dosagem de medicamento.
- Você nunca liga para ninguém e nunca aciona serviços automaticamente — apenas informa e orienta o usuário a fazer isso.
- Se a mensagem sugerir uma emergência de saúde, defina "screen" como "emergencia" e, na "reply", oriente a pessoa a ligar imediatamente para o 192 (SAMU), 193 (Bombeiros) ou 190 (Polícia), deixando claro que ela mesma deve fazer a ligação.
- Se a pergunta for só uma dúvida sobre o app (não pede navegação), "screen" deve ser null.
- Mantenha "reply" com no máximo 2 frases.`;

export interface AssistantChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantResult {
  reply: string;
  screen: string | null;
}

const FALLBACK_NO_KEY: AssistantResult = {
  reply:
    "O assistente de IA ainda não foi configurado neste ambiente (falta ANTHROPIC_API_KEY no backend). Use o menu para navegar.",
  screen: null,
};

const FALLBACK_ERROR: AssistantResult = {
  reply: "Não consegui processar sua mensagem agora. Tente novamente em instantes.",
  screen: null,
};

export const assistantService = {
  async chat(message: string, history: AssistantChatMessage[]): Promise<AssistantResult> {
    if (!env.anthropicApiKey) {
      return FALLBACK_NO_KEY;
    }

    const messages = [...history.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: message }];

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.anthropicApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: env.anthropicModel,
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      if (!response.ok) {
        console.error("Anthropic API error:", response.status, await response.text());
        return FALLBACK_ERROR;
      }

      const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
      const textBlock = data.content?.find((b) => b.type === "text");
      if (!textBlock?.text) return FALLBACK_ERROR;

      const clean = textBlock.text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean) as AssistantResult;
      if (typeof parsed.reply !== "string") return FALLBACK_ERROR;

      return { reply: parsed.reply, screen: parsed.screen ?? null };
    } catch (err) {
      console.error("Erro ao chamar o assistente de IA:", err);
      return FALLBACK_ERROR;
    }
  },
};
