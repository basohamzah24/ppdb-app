# PPDB Online - Setup Database dengan Prisma dan Neon PostgreSQL

## 🗃️ Konfigurasi Database

### 1. Environment Variables

Buat file `.env` di root project:

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_znVT4IQZy8SA@ep-dawn-shape-a1ndtq31-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Development
NODE_ENV="development"
```

### 2. Install Dependencies

```bash
npm install @prisma/client
npm install prisma --save-dev
```

### 3. Setup Prisma

```bash
# Generate Prisma client
npm run db:generate

# Push schema ke database (untuk development)
npm run db:push

# Atau jalankan migrasi (untuk production)
npm run db:migrate

# Seed data awal
npm run db:seed
```

### 4. Test Koneksi

```bash
# Test koneksi database
npm run test:db

# Atau test melalui API
curl http://localhost:3000/api/test-db
```

## 📁 Struktur File

```
├── .env                     # Environment variables
├── prisma/
│   ├── schema.prisma        # Prisma schema
│   └── seed.ts             # Data seeding
├── lib/
│   └── prisma.ts           # Prisma client instance
├── app/api/
│   ├── pendaftar/route.ts  # API endpoint pendaftar
│   └── test-db/route.ts    # Test database API
└── test-prisma.js          # Script test koneksi
```

## 🔧 Commands

| Command | Deskripsi |
|---------|-----------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema ke database |
| `npm run db:migrate` | Jalankan migrasi database |
| `npm run db:studio` | Buka Prisma Studio |
| `npm run db:seed` | Seed data awal |
| `npm run test:db` | Test koneksi database |

## 📊 Schema Database

### Tabel: `pendaftar`
```sql
id           SERIAL PRIMARY KEY
nama         VARCHAR NOT NULL
nik          VARCHAR(16) UNIQUE NOT NULL  
tempat_lahir VARCHAR NOT NULL
tanggal_lahir DATE NOT NULL
jenis_kelamin VARCHAR NOT NULL
alamat       TEXT NOT NULL
nama_ayah    VARCHAR NOT NULL
nama_ibu     VARCHAR NOT NULL
no_telp      VARCHAR NOT NULL
email        VARCHAR
created_at   TIMESTAMP DEFAULT NOW()
updated_at   TIMESTAMP DEFAULT NOW()
```

### Tabel: `sekolah_config`
```sql
id                 SERIAL PRIMARY KEY
nama_sekolah       VARCHAR NOT NULL
alamat_sekolah     VARCHAR NOT NULL
tahun_ajaran       VARCHAR NOT NULL
kuota_siswa        INTEGER NOT NULL
status_pendaftaran BOOLEAN DEFAULT TRUE
created_at         TIMESTAMP DEFAULT NOW()
updated_at         TIMESTAMP DEFAULT NOW()
```

## 🚀 API Endpoints

### POST /api/pendaftar
Mendaftarkan siswa baru

**Body:**
```json
{
  "nama": "Ahmad Budi Santoso",
  "nik": "3171234567890123",
  "tempat_lahir": "Jakarta",
  "tanggal_lahir": "2012-05-15",
  "jenis_kelamin": "Laki-laki",
  "alamat": "Jl. Mawar No. 45, Jakarta Timur",
  "nama_ayah": "Budi Santoso",
  "nama_ibu": "Siti Rahayu",
  "no_telp": "081234567890",
  "email": "budi.santoso@email.com"
}
```

### GET /api/pendaftar
Mengambil daftar semua pendaftar

### GET /api/test-db
Test koneksi database dan informasi PostgreSQL

## 🔒 Keamanan

1. **Environment Variables**: Jangan commit file `.env` ke repository
2. **SSL Connection**: Neon Database menggunakan SSL required
3. **Input Validation**: Semua input divalidasi sebelum disimpan
4. **Prepared Statements**: Prisma otomatis menggunakan prepared statements

## 🐛 Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"
- Pastikan file `.env` ada di root project
- Pastikan `DATABASE_URL` ada dan tidak kosong

### Error: "SSL connection required"
- Pastikan connection string mengandung `sslmode=require`
- Neon Database selalu membutuhkan SSL

### Error: "Schema not in sync"
- Jalankan `npm run db:push` atau `npm run db:migrate`
- Generate ulang client dengan `npm run db:generate`

## 📝 Migration Commands

```bash
# Membuat migrasi baru
npx prisma migrate dev --name init

# Reset database (DANGER!)
npx prisma migrate reset

# Deploy migrasi ke production
npx prisma migrate deploy

# Prisma Studio (GUI database)
npx prisma studio
```

## 🌱 Development Workflow

1. **Setup awal:**
   ```bash
   npm install
   cp .env.example .env  # Edit sesuai kebutuhan
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

2. **Development:**
   ```bash
   npm run dev
   ```

3. **Test koneksi:**
   ```bash
   npm run test:db
   ```

4. **Lihat data:**
   ```bash
   npm run db:studio
   ```