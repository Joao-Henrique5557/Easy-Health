import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

export const hash = {
  async make(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  },
  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  },
  /** Hash simples (sha256) para tokens opacos como refresh token e código de recuperação de senha. */
  sha256(value: string): string {
    return crypto.createHash("sha256").update(value).digest("hex");
  },
  randomToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString("hex");
  },
  /** Código curto numérico, mais fácil de digitar/testar via e-mail simulado. */
  randomCode(digits = 6): string {
    const max = 10 ** digits;
    return String(crypto.randomInt(0, max)).padStart(digits, "0");
  },
};
