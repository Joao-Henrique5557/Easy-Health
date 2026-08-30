import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../env";

export interface AccessTokenPayload {
  sub: string; // userId
}

export const jwtLib = {
  signAccessToken(userId: string): string {
    const options: SignOptions = { expiresIn: env.jwtAccessExpires as SignOptions["expiresIn"] };
    return jwt.sign({ sub: userId }, env.jwtAccessSecret as Secret, options);
  },
  signRefreshToken(userId: string): string {
    const options: SignOptions = { expiresIn: env.jwtRefreshExpires as SignOptions["expiresIn"] };
    return jwt.sign({ sub: userId }, env.jwtRefreshSecret as Secret, options);
  },
  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
  },
  verifyRefreshToken(token: string): AccessTokenPayload {
    return jwt.verify(token, env.jwtRefreshSecret) as AccessTokenPayload;
  },
};
