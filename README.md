# Trusmi Web Analytics & SQL Playground

Sebuah aplikasi berbasis **Next.js (App Router)** yang berfungsi ganda sebagai **Marketing Analytics Dashboard** dan **Secure SQL Playground**. Dibangun dengan arsitektur modern menggunakan Prisma ORM, PostgreSQL, dan Docker untuk lingkungan pengembangan yang mulus.

Live Demo: [https://trusmi.ucokman.web.id](https://trusmi.ucokman.web.id)

## 🚀 Fitur Utama

### 1. Marketing Analytics Dashboard
- Visualisasi pencapaian KPI (Sales & Report) per karyawan secara dinamis.
- Kalkulasi rasio *Leadtime* (*Ontime* vs *Late*) berdasarkan *deadline* dan *aktual* task.
- Terintegrasi langsung dengan database produksi PostgreSQL.

### 2. Secure SQL Playground
- Editor SQL *real-time* berbasis web (menggunakan `react-simple-code-editor` dan PrismJS).
- Mendukung *syntax highlighting* bergaya *twilight* dan manipulasi teks pintar (*Run Selected Query*, *Toggle Comments* dengan `Ctrl + /`).
- **Strict Sandbox Isolation**: Eksekusi SQL dibatasi menggunakan *Interactive Transactions* Prisma yang menurunkan (*downgrade*) hak akses ke `playground_user` dan memaksakan *search_path* ke `sandbox_db`. 
- Aman dari *query* berbahaya—tidak bisa menyentuh maupun meretas skema `public` (Database Utama).
- Dilengkapi mekanisme *Rate Limiting* (in-memory) dan perlindungan batas waktu (*Statement Timeout* 3 detik).


## 🛠️ Tech Stack

- **Framework**: Next.js 15 (Turbopack)
- **Bahasa**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma Client & Prisma Adapter PG
- **Styling**: Tailwind CSS & shadcn/ui
- **Container**: Docker & Docker Compose
- **Runtime Manager**: Bun / Node.js


## 📦 Cara Instalasi & Menjalankan (Development)

Proyek ini telah dikonfigurasi untuk berjalan mulus di dalam **Docker**. Anda tidak perlu melakukan setup database secara manual di host komputer Anda.

### Persyaratan Sistem
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- Lingkungan Terminal (Bash / WSL2 untuk Windows)

### Langkah-langkah
1. *Clone* repositori ini.
2. Masuk ke dalam direktori `web`:
   ```bash
   cd web
   ```
3. Jalankan script manajer interaktif:
   ```bash
   ./run.sh
   ```
4. Anda akan melihat menu **TRUSMI WEB DOCKER MANAGER**. Pilih opsi **1 (Up)**.
   - Script akan otomatis men-*build* container.
   - Menjalankan PostgreSQL.
   - Melakukan `prisma db push` dan `prisma db seed` (men-*generate* dummy data KPI & menyiapkan role keamanan *Playground*).
   - Men-*generate* ulang konfigurasi Prisma Client.
5. Buka browser dan akses: **`http://localhost:3000`**


## 🔒 Arsitektur Keamanan Playground

Demi memastikan bahwa fitur **SQL Playground** tidak dapat digunakan untuk merusak data internal dashboard, aplikasi menerapkan sistem pertahanan berlapis:
1. **User Khusus**: Saat di-*seed*, sebuah *role* `playground_user` dibuat tanpa akses ke `public`.
2. **Skema Terisolasi**: Semua operasi akan diletakkan di dalam skema `sandbox_db`.
3. **Pengekangan Eksekusi**: API `/api/playground/execute` berjalan di atas Prisma `$transaction` dan otomatis mengeksekusi `SET LOCAL ROLE playground_user` serta `SET LOCAL search_path TO sandbox_db` secara mikrosekon sebelum mengeksekusi *query* pengguna.
4. **OOM & DoS Protection**: *Query* dibatasi dengan `LIMIT 500` dan batas *timeout* 3000ms.

