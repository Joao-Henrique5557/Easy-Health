# ---- Etapa 1: build ----
FROM node:20-alpine AS builder
WORKDIR /app

# O Prisma precisa do OpenSSL disponível no sistema para detectar a versão
# correta e escolher o engine binário certo. Imagens node:*-alpine não vêm
# com OpenSSL instalado por padrão — sem isso, o Prisma "adivinha" errado
# (cai no fallback openssl-1.1.x) e o engine falha silenciosamente ao
# rodar, quebrando com um erro cripto de "resposta não é JSON válido".
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# ---- Etapa 2: runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Mesmo motivo do estágio de build: o entrypoint roda `prisma migrate
# deploy` aqui dentro, e isso também precisa do OpenSSL do sistema.
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3333

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
