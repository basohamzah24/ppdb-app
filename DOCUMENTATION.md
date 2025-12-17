# 📋 PPDB Online - Form Pendaftaran Peserta Didik Baru

## 🎯 Ringkasan Sistem

Sistem PPDB Online yang telah dibuat menggunakan **Next.js App Router** dengan desain **mobile-first** yang responsif untuk Android dan iPhone. Database menggunakan **PostgreSQL Neon** dengan prepared statements untuk keamanan.

## 🏗️ Arsitektur Sistem

```
PPDB Apps/
├── 🏠 Homepage (/)              → Landing page dengan info PPDB
├── 📝 Form (/pendaftaran)       → Form pendaftaran responsif
├── 🔌 API (/api/pendaftar)      → Backend endpoint
└── 🗄️ PostgreSQL Database      → Penyimpanan data di Neon
```

## 💻 Kode Implementasi

### 1. Form Pendaftaran (`app/pendaftaran/page.tsx`)

**Fitur Utama:**
- ✅ Mobile-first responsive design
- ✅ Real-time validation
- ✅ Touch-friendly UI (py-3 untuk area sentuh optimal)
- ✅ Error/success notifications
- ✅ Loading states

**Field Form:**
- **Nama Lengkap** (text, required)
- **NISN** (text, 10 digit, required)
- **Email** (email, required)
- **Asal Sekolah** (text, required)
- **Jalur Pendaftaran** (select: Zonasi/Prestasi/Afirmasi)

**Validasi Frontend:**
- Semua field wajib diisi
- NISN harus 10 digit angka
- Email format valid
- Jalur pendaftaran sesuai pilihan

### 2. API Backend (`app/api/pendaftar/route.ts`)

**Endpoints:**
- **POST** `/api/pendaftar` → Submit pendaftaran baru
- **GET** `/api/pendaftar` → Retrieve semua data pendaftar

**Keamanan:**
- ✅ Prepared statements (SQL injection prevention)
- ✅ Input validation & sanitization
- ✅ Duplicate checking (NISN & email)
- ✅ Error handling yang comprehensive

**Database Operations:**
```sql
-- Insert dengan prepared statement
INSERT INTO pendaftar (nama_lengkap, nisn, email, asal_sekolah, jalur_pendaftaran, tanggal_daftar) 
VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
```

### 3. Database Schema (`database/schema.sql`)

```sql
CREATE TABLE pendaftar (
  id SERIAL PRIMARY KEY,
  nama_lengkap VARCHAR(100) NOT NULL,
  nisn VARCHAR(10) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  asal_sekolah VARCHAR(100) NOT NULL,
  jalur_pendaftaran VARCHAR(20) CHECK (jalur_pendaftaran IN ('Zonasi', 'Prestasi', 'Afirmasi')),
  tanggal_daftar TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status_pendaftaran VARCHAR(20) DEFAULT 'Menunggu',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes untuk Performance:**
- `idx_pendaftar_nisn` → Pencarian berdasarkan NISN
- `idx_pendaftar_email` → Pencarian berdasarkan email
- `idx_pendaftar_jalur` → Filter berdasarkan jalur
- `idx_pendaftar_tanggal` → Sorting berdasarkan tanggal daftar

## 🔄 Alur Sistem

### Flow Pendaftaran:
1. **User** mengakses `/pendaftaran`
2. **Frontend** menampilkan form responsif
3. **User** mengisi dan submit form
4. **Frontend** validasi input
5. **API** terima POST request
6. **Backend** validasi ulang + cek duplikasi
7. **Database** simpan dengan prepared statement
8. **Response** sukses/error ke frontend
9. **UI** tampilkan notifikasi ke user

### Error Handling:
- ❌ Field kosong → "Semua field harus diisi"
- ❌ NISN invalid → "NISN harus 10 digit angka"  
- ❌ Email invalid → "Format email tidak valid"
- ❌ NISN duplicate → "NISN sudah terdaftar"
- ❌ Email duplicate → "Email sudah terdaftar"
- ❌ Database error → "Terjadi kesalahan server"

## 📱 Responsive Design Features

### Mobile-First Approach:
- **Container**: `max-w-md mx-auto` untuk mobile
- **Touch Target**: `py-3` (48px minimum) untuk tombol
- **Typography**: Font size optimal untuk layar kecil
- **Spacing**: Adequate padding dan margin
- **Focus States**: Clear visual feedback

### Breakpoints:
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` prefix (≥ 768px)
- **Desktop**: `lg:` prefix (≥ 1024px)

## 🚀 Setup & Running

### Prerequisites:
```bash
npm install
```

### Environment Setup:
```bash
# .env.local sudah dikonfigurasi
DATABASE_URL="postgresql://neondb_owner:..."
```

### Database Setup:
```bash
# Jalankan script SQL ke PostgreSQL Neon
psql <connection_string> -f database/setup.sql
```

### Development:
```bash
npm run dev
# Akses: http://localhost:3000
```

### Testing:
```bash
# Test validasi
node test-api-simple.js

# Test API endpoints
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

## 🔒 Keamanan Implementation

1. **SQL Injection Prevention**: Prepared statements di semua query
2. **Input Validation**: Double validation (frontend + backend)
3. **Data Sanitization**: Proper escaping dan validation
4. **Connection Pooling**: Optimal database connection management
5. **Error Handling**: Tidak expose sensitive information

## 📊 Database Connection Details

**PostgreSQL Neon:**
- Host: `ep-dawn-shape-a1ndtq31-pooler.ap-southeast-1.aws.neon.tech`
- Database: `neondb`
- SSL: Required
- Connection pooling: max 20 connections

## ✅ Fitur Telah Terimplementasi

- ✅ Mobile-first responsive design
- ✅ Form validation (frontend + backend)
- ✅ PostgreSQL integration dengan Neon
- ✅ Prepared statements untuk keamanan
- ✅ 3 Jalur pendaftaran (Zonasi, Prestasi, Afirmasi)
- ✅ Duplicate checking (NISN & email)
- ✅ Real-time feedback notifications
- ✅ Touch-friendly UI untuk mobile
- ✅ Error handling yang comprehensive
- ✅ Landing page dengan navigasi
- ✅ API endpoints (GET/POST)

## 🧪 Manual Testing

### Test Data:
```json
{
  "nama_lengkap": "Test User",
  "nisn": "1234567890",
  "email": "test@email.com",
  "asal_sekolah": "SMP Test",
  "jalur_pendaftaran": "Zonasi"
}
```

### Test Cases:
1. ✅ Form submission dengan data valid
2. ✅ Validation error untuk field kosong
3. ✅ NISN format validation (harus 10 digit)
4. ✅ Email format validation
5. ✅ Duplicate detection
6. ✅ Responsive design di mobile/desktop
7. ✅ API endpoints functionality

## 📝 Best Practices Implemented

- **Folder Structure**: Sesuai Next.js App Router convention
- **TypeScript**: Type safety di seluruh aplikasi
- **Error Boundaries**: Proper error handling
- **Loading States**: User feedback selama processing
- **Accessibility**: Focus states dan keyboard navigation
- **Performance**: Connection pooling dan optimized queries
- **Security**: Prepared statements dan input validation