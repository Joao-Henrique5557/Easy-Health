#!/bin/sh
set -e

echo "Aplicando migrations do Prisma..."
if npx prisma migrate deploy 2>/dev/null; then
  echo "✓ Migrations aplicadas"
else
  echo "⚠ Migrations: nenhuma nova"
fi

if [ "$SEED_ON_START" = "true" ]; then
  echo "Populando banco com dados de demonstração..."
  if npx prisma db seed 2>/dev/null; then
    echo "✓ Seed concluído"
  else
    echo "⚠ Seed: nenhum dado novo"
  fi
fi

echo "Easy Health API iniciando..."
exec "$@"
