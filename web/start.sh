#!/bin/sh
set -e

echo "Menyiapkan Database Production..."
# Push schema tanpa interaksi (otomatis membuat tabel jika belum ada)
bunx prisma db push --accept-data-loss

echo "Menjalankan Seeding & Setup Role..."
# Menjalankan script seed.ts menggunakan bun
bunx prisma db seed

echo "Memulai Server Aplikasi..."
# Jalankan Next.js server hasil build standalone
exec bun run server.js
