#!/bin/sh
set -e

echo "Menyiapkan Database Production..."
# Gunakan prisma CLI dari folder isolasi /migration
/migration/node_modules/.bin/prisma db push --accept-data-loss

echo "Menjalankan Seeding & Setup Role..."
# Menjalankan script seed.ts langsung menggunakan bun
bun prisma/seed.ts

echo "Memulai Server Aplikasi..."
# Jalankan Next.js server hasil build standalone
exec bun run server.js
