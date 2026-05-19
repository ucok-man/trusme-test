# Jawaban Soal 5: Normalisasi Tabel `table_kpi_marketing`

Kalau kita perhatikan struktur awal dari `table_kpi_marketing`, bentuknya masih berupa *flat table* (semua data digabung jadi satu kolom demi kolom). Untuk aplikasi skala besar, struktur ini rawan bikin masalah di kemudian hari.

### Kenapa tabel ini harus dinormalisasi?
1. **Data Redundan (Berulang):** Nama karyawan seperti "Budi" dan jenis KPI seperti "Sales" dan "Report" ditulis berulang kali di setiap baris tugas. Ini bikin berat *storage* dan bikin proses *indexing* di database jadi kurang efisien.
2. **Rawan *Typo* / Inkonsistensi:** Karena kolom `karyawan` dan `kpi` cuma teks biasa (*varchar*), admin bisa saja salah input (misal nulis "budi", "Budy", atau "Budi S."). Nanti pas kita mau nge-Group atau Pivot datanya buat bikin laporan, hasilnya bakal berantakan karena beda 1 huruf aja dihitung sebagai orang yang beda.
3. **Susah Di-*maintain*:** Di soal disebutkan kalau masing-masing KPI bobotnya 50%. Di tabel awal, informasi *bobot* ini nggak ada tempatnya (jadi harus di-*hardcode* di dalam *source code* aplikasi). Bayangin kalau besok manajemen minta bobot "Sales" naik jadi 70%, kita bakal repot harus ngedit *code*.

---

### Step Normalisasi (Pendekatan)

Menurut saya, biar lebih solid dan masuk ke standar minimal 3NF (Third Normal Form), kita perlu memecah tabel raksasa ini menjadi 3 tabel terpisah yang saling berelasi:
1. **Tabel Master Karyawan:** Khusus nyimpen data identitas orangnya.
2. **Tabel Master KPI:** Khusus nyimpen jenis KPI dan aturan bobotnya.
3. **Tabel Transaksi (Tasks):** Cuma nyimpen log daftar tugas dan me-relasikan id karyawan dengan id kpi.

---

### Desain Database Baru (Hasil Normalisasi)

#### 1. Tabel `karyawan` (Master Data)
Tabel ini buat nyimpen data pokok karyawannya secara unik. Kalau ada perubahan nama, kita cukup edit di sini 1x saja.
```sql
CREATE TABLE `karyawan` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nama` varchar(100) NOT NULL,
  `divisi` varchar(50) DEFAULT 'Marketing'
);
```
**Contoh isinya:**
| id | nama | divisi |
|---|---|---|
| 1 | Budi | Marketing |
| 2 | Adi | Marketing |

#### 2. Tabel `kategori_kpi` (Master Data)
Tabel ini nyimpen aturan main dari tiap KPI. Jadi kalau besok-besok ada KPI baru (misal: "Visit") atau bobotnya mau diubah, kita tinggal *update* tabel ini tanpa perlu nyentuh *code* di aplikasi.
```sql
CREATE TABLE `kategori_kpi` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nama_kpi` varchar(50) NOT NULL,
  `bobot_persen` int(3) NOT NULL DEFAULT 50 -- nyimpen angka bobot dasar
);
```
**Contoh isinya:**
| id | nama_kpi | bobot_persen |
|---|---|---|
| 1 | Sales | 50 |
| 2 | Report | 50 |

#### 3. Tabel `transaksi_task` (Tabel Relasi)
Ini adalah tabel pengganti tabel mentah yang lama. Bedanya, di sini kita nggak lagi nulis "Budi" atau "Sales" pakai teks panjang, tapi cukup nulis `karyawan_id` dan `kategori_kpi_id`-nya aja.

```sql
CREATE TABLE `transaksi_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `karyawan_id` int(11) NOT NULL,
  `kategori_kpi_id` int(11) NOT NULL,
  `nama_task` varchar(100) NOT NULL,
  `deadline` date NOT NULL,
  `aktual` date DEFAULT NULL,
  
  -- Bikin relasi (Foreign Key) biar datanya terikat dan nggak ada data gaib
  FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`kategori_kpi_id`) REFERENCES `kategori_kpi`(`id`) ON DELETE RESTRICT
);
```
**Contoh isinya:**
| id | karyawan_id | kategori_kpi_id | nama_task | deadline | aktual |
|---|---|---|---|---|---|
| 1 | 1 | 1 | Tasklist 1 | 2022-01-10 | 2022-01-09 |
| 2 | 1 | 1 | Tasklist 2 | 2022-01-10 | 2022-01-08 |

---

### Kesimpulan & Benefit
Dengan memecahnya pakai sistem relasi (*Foreign Key*) seperti di atas:
* **Ukuran database lebih enteng:** Karena kita nyimpen data relasi berulang berupa integer (`id`), bukan teks string.
* **Aman dari human-error:** Karyawan dan jenis KPI di-pilih berdasar sistem referensi (misal di frontend jadinya sistem *dropdown*), bukan diketik bebas lagi. Integritas datanya sangat terjamin.
