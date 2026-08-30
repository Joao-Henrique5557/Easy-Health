import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "./errors";

// Middleware de erro DEVE ter 4 parâmetros para o Express reconhecê-lo como
// error handler (mesmo `next` não sendo usado no corpo) — essa é uma
// pegadinha clássica do Express, por isso o comentário.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos.",
      issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "Erro interno do servidor." });
}
