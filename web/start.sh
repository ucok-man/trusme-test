#!/bin/sh
set -e

echo "Menyiapkan Database Production..."
# Push schema tanpa interaksi
bunx prisma db push --accept-data-loss

echo "Menjalankan Seeding & Setup Role..."
# Menjalankan script seed.ts langsung menggunakan bun
bun prisma/seed.ts

echo "Memulai Server Aplikasi..."
# Jalankan Next.js server mode standard
exec bun run start
