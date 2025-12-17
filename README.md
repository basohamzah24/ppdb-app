# 🎓 PPDB Online - Sistem Penerimaan Peserta Didik Baru

Sistem PPDB Online yang modern dan lengkap dengan **panel admin real-time** untuk mengelola konten dan pengaturan PPDB.

## ✨ Fitur Utama

### 🔐 Panel Admin Lengkap
- **Manajemen Konten Situs**: Edit hero section, about, contact info, dan pengumuman
- **Pengaturan PPDB**: Kelola tahun ajaran, status, jadwal, kuota, persyaratan, dan alur pendaftaran
- **Dashboard**: Statistik dan overview sistem PPDB
- **Sinkronisasi Real-time**: Perubahan admin langsung tampil di halaman publik

### 📱 Halaman Publik Dinamis
- **Dynamic Content**: Semua konten diambil dari database (tidak hardcoded)
- **Status PPDB Real-time**: Banner status buka/tutup yang update otomatis
- **Info Modal**: Detail persyaratan dan alur pendaftaran dari admin
- **Responsive Design**: Tampil sempurna di mobile dan desktop

### 🔒 Keamanan & Validasi
- **Server-side Validation**: Semua input divalidasi di server
- **Authentication System**: Login admin yang aman dengan bcrypt
- **Middleware Protection**: Proteksi rute admin otomatis
- **SQL Injection Prevention**: Menggunakan Prisma ORM

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon Cloud)
- **ORM**: Prisma ORM
- **Authentication**: Custom auth dengan bcryptjs
- **Cache**: Next.js revalidatePath untuk real-time sync

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database**:
   - Jalankan script SQL di `database/schema.sql` ke PostgreSQL Neon
   - Connection string sudah dikonfigurasi di `lib/db.ts`

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Akses aplikasi**:
   - Homepage: [http://localhost:3000](http://localhost:3000)
   - Form Pendaftaran: [http://localhost:3000/pendaftaran](http://localhost:3000/pendaftaran)

## 📁 Struktur Folder

```
ppdb-apps/
├── app/
│   ├── pendaftaran/
│   │   └── page.tsx          # Form pendaftaran
│   ├── api/
│   │   └── pendaftar/
│   │       └── route.ts      # API endpoint
│   ├── page.tsx              # Homepage
│   └── layout.tsx
├── lib/
│   └── db.ts                 # Database connection
├── database/
│   └── schema.sql            # SQL schema
└── README.md
```

## 🎯 Alur Sistem

1. **User mengakses** `/pendaftaran`
2. **Mengisi form** dengan data:
   - Nama lengkap
   - NISN (10 digit)
   - Email
   - Asal sekolah
   - Jalur pendaftaran
3. **Frontend validasi** input
4. **Submit ke API** `/api/pendaftar`
5. **Backend validasi** dan cek duplikasi
6. **Simpan ke PostgreSQL** dengan prepared statement
7. **Return response** sukses/error

## 🗄️ Database Schema

```sql
CREATE TABLE pendaftar (
  id SERIAL PRIMARY KEY,
  nama_lengkap VARCHAR(100) NOT NULL,
  nisn VARCHAR(10) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  asal_sekolah VARCHAR(100) NOT NULL,
  jalur_pendaftaran VARCHAR(20) NOT NULL CHECK (jalur_pendaftaran IN ('Zonasi', 'Prestasi', 'Afirmasi')),
  tanggal_daftar TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status_pendaftaran VARCHAR(20) DEFAULT 'Menunggu',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 📱 Responsive Features

- **Mobile-first design**
- **Touch-friendly buttons** (py-3 untuk area sentuh optimal)
- **Clear typography** untuk keterbacaan di layar kecil
- **Max-width container** untuk desktop
- **Gradient background** yang menarik
- **Focus states** untuk accessibility

## 🔒 Keamanan

- ✅ Prepared statements untuk SQL injection prevention
- ✅ Input validation di frontend dan backend
- ✅ Email dan NISN uniqueness check
- ✅ Data sanitization
- ✅ Error handling yang proper

## 🧪 Testing

Untuk test API endpoint:

```bash
curl -X POST http://localhost:3000/api/pendaftar \
  -H "Content-Type: application/json" \
  -d '{
    "nama_lengkap": "Test User",
    "nisn": "1234567890",
    "email": "test@email.com",
    "asal_sekolah": "SMP Test",
    "jalur_pendaftaran": "Zonasi"
  }'
```

## 📝 Development Notes

- Connection string ke Neon PostgreSQL sudah dikonfigurasi
- Menggunakan connection pooling untuk performa
- Error handling untuk berbagai skenario database
- Responsive breakpoints: mobile-first approach
- TypeScript untuk type safety
