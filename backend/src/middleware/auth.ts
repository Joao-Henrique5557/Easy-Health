import { NextFunction, Request, Response } from "express";
import { jwtLib } from "../lib/jwt";
import { unauthorized } from "./errors";

// Estende o tipo Request do Express para carregar o id do usuário
// autenticado, preenchido por este middleware.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Exige um Bearer Token válido (regra do readme, seção 21: "Todas as rotas
 * exceto autenticação e conteúdo público devem exigir um token de acesso
 * válido"). Em caso de token ausente/expirado/inválido, responde 401 — o
 * interceptor do axios no frontend (`src/services/api.ts`) trata esse status
 * tentando renovar via /api/auth/refresh-token antes de derrubar a sessão.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(unauthorized("Token de acesso ausente."));
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwtLib.verifyAccessToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    next(unauthorized("Token de acesso inválido ou expirado."));
  }
}
