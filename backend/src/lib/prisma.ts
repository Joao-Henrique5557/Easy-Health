import { PrismaClient } from "@prisma/client";

// Instância única do Prisma Client compartilhada por toda a aplicação —
// evita esgotar o pool de conexões do Postgres em desenvolvimento (hot
// reload criando um client novo a cada mudança de arquivo).
export const prisma = new PrismaClient();
