export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (msg: string) => new HttpError(400, msg);
export const unauthorized = (msg = "Não autenticado.") => new HttpError(401, msg);
export const forbidden = (msg = "Sem permissão.") => new HttpError(403, msg);
export const notFound = (msg = "Recurso não encontrado.") => new HttpError(404, msg);
export const conflict = (msg: string) => new HttpError(409, msg);
