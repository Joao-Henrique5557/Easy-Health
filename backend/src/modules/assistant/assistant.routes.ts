import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth } from "../../middleware/auth";
import { assistantService } from "./assistant.service";
import { assistantMessageSchema } from "./assistant.validators";

// Rota do Assistente de IA — POST /api/assistant/message.
//
// Esta rota NÃO está na lista original de rotas do readme (seção 21);
// foi adicionada especificamente para o Assistente de IA (seção 6.8),
// documentada em frontend/README.md desde a criação do protótipo React.
// A chave da Anthropic fica só aqui no servidor — o app nunca a expõe.
export const assistantRouter = Router();
assistantRouter.use(requireAuth);

assistantRouter.post(
  "/message",
  asyncHandler(async (req, res) => {
    const { message, history } = assistantMessageSchema.parse(req.body);
    const result = await assistantService.chat(message, history);
    res.json(result);
  })
);
