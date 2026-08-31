#!/bin/sh
set -e

echo "Aplicando migrations do Prisma..."
if npx prisma migrate deploy; then
  echo "Migrations aplicadas com sucesso."
else
  echo "Erro ao aplicar migrations. Continuando..."
fi

if [ "$SEED_ON_START" = "true" ]; then
  echo "Populando banco com dados de demonstração (SEED_ON_START=true)..."
  if npx prisma db seed; then
    echo "Seed concluído com sucesso."
  else
    echo "Seed falhou ou já foi executado antes — seguindo em frente."
  fi
fi

echo "Easy Health API iniciando..."
exec "$@"
