# LaundryYuk

Aplikasi web untuk layanan laundry. Proyek ini terdiri dari frontend React dan
backend Node.js/Express yang terhubung ke database MySQL.

## Fitur

- Registrasi dan login pelanggan.
- Pembuatan pesanan laundry.
- Melihat pesanan yang sedang diproses dan riwayat pesanan.
- Pengelolaan pesanan dan status oleh admin.
- Pemberian rating dan ulasan untuk pesanan.

## Teknologi

- **Frontend:** React, Vite, React Router
- **Backend:** Node.js, Express
- **Database:** MySQL

## Persiapan

Pastikan sudah memasang:

- Node.js 20.19+ atau 22.12+, beserta npm.
- MySQL, misalnya melalui XAMPP.

Backend mengharapkan database MySQL yang sudah berisi tabel `users`, `laundry`,
`detail_laundry`, `harga`, dan `feedback`, serta stored procedure
`sp_update_status`. File skema SQL belum disertakan dalam repository ini.

## Menjalankan aplikasi

### 1. Siapkan backend

```bash
cd laundryyuk-backend
npm install
```

Buat file `.env` di folder `laundryyuk-backend` dengan konfigurasi database
Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=laundryyuk
PORT=5000
```

Sesuaikan nilainya dengan pengaturan MySQL lokal. File `.env` berisi informasi
rahasia dan tidak boleh di-commit.

Jalankan server:

```bash
node server.js
```

Secara default, backend berjalan di `http://localhost:5000`.

### 2. Jalankan frontend

Buka terminal lain dari folder proyek:

```bash
cd laundryyuk-frontend
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal.

## Endpoint API

Backend menyediakan endpoint berikut:

| Method | Endpoint | Kegunaan |
| --- | --- | --- |
| `POST` | `/api/register` | Mendaftarkan pelanggan |
| `POST` | `/api/login` | Login pelanggan atau admin |
| `POST` | `/api/laundry` | Membuat pesanan laundry |
| `GET` | `/api/laundry/proses/:user_id` | Melihat pesanan pelanggan yang belum selesai |
| `GET` | `/api/admin/orders` | Melihat seluruh pesanan |
| `PUT` | `/api/admin/orders/:id` | Memperbarui status pesanan |
| `POST` | `/api/laundry/feedback` | Mengirim rating dan ulasan |

## Catatan konfigurasi

Frontend saat ini memanggil backend pada `http://localhost:5000`. Jika alamat
atau port backend diubah, sesuaikan URL API di frontend. Kredensial admin
contoh masih ditentukan langsung di kode backend; ubah mekanisme tersebut
sebelum aplikasi digunakan di lingkungan publik.
