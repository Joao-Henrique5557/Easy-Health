#!/bin/sh
# Roda as migrations do Prisma (e o seed, se o banco estiver vazio) antes
# de subir a API — evita ter que rodar isso manualmente a cada `docker
# compose up` durante o desenvolvimento/apresentação do projeto.
set -e

echo "Aplicando migrations do Prisma..."
npx prisma migrate deploy

if [ "$SEED_ON_START" = "true" ]; then
  echo "Populando banco com dados de demonstração (SEED_ON_START=true)..."
  npx prisma db seed || echo "Seed falhou ou já foi executado antes — seguindo em frente."
fi

exec "$@"
