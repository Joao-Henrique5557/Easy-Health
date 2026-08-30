import { prisma } from "../../lib/prisma";
import { hash } from "../../lib/hash";
import { jwtLib } from "../../lib/jwt";
import { badRequest, conflict, notFound, unauthorized } from "../../middleware/errors";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias
const RESET_CODE_TTL_MS = 15 * 60 * 1000; // 15 minutos

function toPublicUser(user: { id: string; nome: string; email: string }) {
  return { id: user.id, nome: user.nome, email: user.email };
}

async function issueTokens(userId: string) {
  const accessToken = jwtLib.signAccessToken(userId);
  const refreshToken = jwtLib.signRefreshToken(userId);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hash.sha256(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: { nome: string; email: string; telefone?: string; senha: string; dataNascimento?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw conflict("Já existe uma conta com este e-mail.");

    const senhaHash = await hash.make(input.senha);
    const user = await prisma.user.create({
      data: {
        nome: input.nome,
        email: input.email,
        telefone: input.telefone,
        senhaHash,
        dataNascimento: input.dataNascimento ? new Date(input.dataNascimento) : undefined,
      },
    });

    const tokens = await issueTokens(user.id);
    return { ...tokens, usuario: toPublicUser(user) };
  },

  async login(input: { email: string; senha: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw unauthorized("E-mail ou senha inválidos.");

    const senhaOk = await hash.compare(input.senha, user.senhaHash);
    if (!senhaOk) throw unauthorized("E-mail ou senha inválidos.");

    const tokens = await issueTokens(user.id);
    return { ...tokens, usuario: toPublicUser(user) };
  },

  async logout(userId: string) {
    await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  },

  async refresh(refreshToken: string) {
    let payload;
    try {
      payload = jwtLib.verifyRefreshToken(refreshToken);
    } catch {
      throw unauthorized("Refresh token inválido ou expirado.");
    }

    const tokenHash = hash.sha256(refreshToken);
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw unauthorized("Refresh token inválido ou expirado.");
    }

    // Rotação: revoga o token usado e emite um par novo — reduz o impacto
    // de um refresh token vazado (só pode ser usado uma vez).
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
    return issueTokens(payload.sub);
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    // Não revela se o e-mail existe ou não (evita enumeração de contas) —
    // sempre responde com sucesso; só gera/loga o código se o usuário existir.
    if (!user) return;

    const code = hash.randomCode(6);
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        codeHash: hash.sha256(code),
        expiresAt: new Date(Date.now() + RESET_CODE_TTL_MS),
      },
    });

    // Sem serviço de e-mail real configurado neste projeto acadêmico —
    // o código é logado no console do backend para fins de teste/demo.
    // Em produção isso viraria um envio real (ex: SendGrid), sem nunca
    // logar ou retornar o código pela API.
    console.log(`[forgot-password] Código de recuperação para ${email}: ${code}`);
  },

  async resetPassword(codigo: string, novaSenha: string) {
    const codeHash = hash.sha256(codigo);
    const reset = await prisma.passwordReset.findFirst({
      where: { codeHash, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (!reset) throw badRequest("Código de recuperação inválido ou expirado.");

    const senhaHash = await hash.make(novaSenha);
    await prisma.$transaction([
      prisma.user.update({ where: { id: reset.userId }, data: { senhaHash } }),
      prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } }),
      // Invalida todas as sessões ativas — força novo login com a senha nova.
      prisma.refreshToken.updateMany({ where: { userId: reset.userId, revoked: false }, data: { revoked: true } }),
    ]);
  },

  async requestEmailVerification(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw notFound("Usuário não encontrado.");

    const code = hash.randomCode(6);
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationCodeHash: hash.sha256(code) },
    });
    console.log(`[verify-email] Código de verificação para ${email}: ${code}`);
  },

  async verifyEmail(email: string, codigo: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.emailVerificationCodeHash) throw badRequest("Código de verificação inválido.");
    if (user.emailVerificationCodeHash !== hash.sha256(codigo)) {
      throw badRequest("Código de verificação inválido.");
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificado: true, emailVerificationCodeHash: null },
    });
  },
};
