# Tugas 2 - Pengembangan Aplikasi Backend

Aplikasi backend untuk manajemen produk menggunakan Express.js dan MySQL.

---

## 🚀 Install Dependensi

### 1. Clone atau Buka Project
```bash
cd /path/to/Tugas2-Pengembangan_aplikasi_backend
```

### 2. Install Package Dependencies
```bash
npm install
```

Perintah ini akan menginstall semua dependensi yang terdaftar di `package.json`:
- **Express.js** - Framework web
- **MySQL2** - Driver MySQL
- **Knex.js** - Query builder
- **dotenv** - Manajemen environment variables

---

## 🗄️ Setup Database & Migration

### 1. Konfigurasi Environment Variables

Buat file `.env` di root directory project:
```bash
cp .env.example .env    # Jika ada file .env.example
# atau buat file baru
nano .env
```

Edit file `.env` dengan konfigurasi database Anda:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=backend_2
PORT=3000
```

**Penjelasan:**
- `DB_HOST` - Host MySQL (default: localhost)
- `DB_USER` - Username MySQL (default: root)
- `DB_PASS` - Password MySQL (default: kosong)
- `DB_NAME` - Nama database (default: backend_2)
- `PORT` - Port untuk menjalankan aplikasi (default: 3000)

### 2. Jalankan Migration

Migration akan membuat database dan tabel secara otomatis:
```bash
npm run migrate
```

**Output yang diharapkan:**
```
Menghubungkan ke MySQL di localhost sebagai root...
Database 'backend_2' siap (dibuat atau sudah ada).
Tabel 'produk' siap (dibuat atau sudah ada).
Tabel 'kategori' siap (dibuat atau sudah ada).
✅ Migrasi database backend_2, tabel produk, dan tabel kategori berhasil diselesaikan!
```

**Tabel yang dibuat:**
- **produk** - Menyimpan data produk (id, name, price, stock, category)
- **kategori** - Menyimpan daftar kategori (id, name)

---

## ▶️ Menjalankan Project

### Mode Production
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

### Mode Development (dengan auto-reload)
```bash
npm run dev
```

Mode development akan otomatis reload ketika ada perubahan kode.

**Output yang diharapkan:**
```
Server berjalan di http://localhost:3000
```

---

## 🧪 Testing REST API

### Opsi 1: Menggunakan UI Dashboard
Buka browser dan akses:
```
http://localhost:3000
```

Dashboard UI akan muncul dengan interface untuk testing semua endpoint.

### Opsi 2: Menggunakan curl (Terminal/Command Prompt)

#### A. GET - Menampilkan semua produk
```bash
curl -X GET http://localhost:3000/api/products
```

#### B. POST - Menambah produk baru
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 10000000,
    "stock": 5,
    "category": "Electronics"
  }'
```

#### C. PUT - Mengubah data produk
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming",
    "price": 12000000,
    "stock": 3,
    "category": "Electronics"
  }'
```

#### D. DELETE - Menghapus produk
```bash
curl -X DELETE http://localhost:3000/api/products/1
```

#### E. GET - Menampilkan semua kategori
```bash
curl -X GET http://localhost:3000/api/kategori
```

#### F. POST - Menambah kategori baru
```bash
curl -X POST http://localhost:3000/api/kategori \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics"
  }'
```

### Opsi 3: Menggunakan Postman atau Insomnia
1. Download [Postman](https://www.postman.com/downloads/) atau [Insomnia](https://insomnia.rest/)
2. Import collection atau buat request manual
3. Test semua endpoint sesuai contoh di Opsi 2

### Response Format
Success Response (200):
```json
{
  "success": true,
  "message": "Berhasil mengambil semua produk",
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 10000000,
      "stock": 5,
      "category": "Electronics"
    }
  ]
}
```

Error Response (400/500):
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

---

## 📝 API Endpoints Reference

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/products` | Menampilkan semua produk |
| POST | `/api/products` | Menambah produk baru |
| GET | `/api/products/:id` | Menampilkan produk berdasarkan ID |
| PUT | `/api/products/:id` | Mengubah data produk |
| DELETE | `/api/products/:id` | Menghapus produk |
| GET | `/api/kategori` | Menampilkan semua kategori |
| POST | `/api/kategori` | Menambah kategori baru |

---

## 🔧 Troubleshooting

### Error: "Cannot find module 'express'"
**Solusi:** Jalankan `npm install` terlebih dahulu

### Error: "Connection refused" atau "ECONNREFUSED"
**Solusi:** 
- Pastikan MySQL sudah berjalan
- Cek konfigurasi DB di file `.env`
- Verify credentials MySQL Anda

### Error: "Database doesn't exist"
**Solusi:** Jalankan `npm run migrate` untuk membuat database dan tabel

### Port 3000 sudah digunakan
**Solusi:** 
- Ubah `PORT` di file `.env`
- Atau kill process yang menggunakan port tersebut

---

## 📦 Scripts Tersedia

```bash
npm start      # Jalankan server (production mode)
npm run dev    # Jalankan server dengan auto-reload (development mode)
npm run migrate # Jalankan database migration
npm test       # Jalankan test suite (belum dikonfigurasi)
```

---

## 📂 Struktur Project

```
Tugas2-Pengembangan_aplikasi_backend/
├── index.js          # File utama aplikasi
├── db.js            # Konfigurasi koneksi database
├── migrate.js       # Script untuk migration database
├── package.json     # Dependencies dan scripts
├── .env             # Environment variables (buat sendiri)
├── public/          # File statis (UI Dashboard)
│   └── index.html   # UI untuk testing API
└── README.md        # File ini
```

**Dibuat untuk Tugas 2 - Pengembangan Aplikasi Backend**
