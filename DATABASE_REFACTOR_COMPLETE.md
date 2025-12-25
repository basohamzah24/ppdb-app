# Refactor Dokumen ke Tabel Pendaftar

## 📋 Overview
Berhasil melakukan refactoring struktur database untuk menyimpan data dokumen langsung di tabel `pendaftar` instead of tabel `dokumen` terpisah. Ini membuat struktur lebih sederhana dan query lebih efisien.

## 🔄 Perubahan Struktur Database

### Before (Tabel Terpisah)
```sql
-- Tabel pendaftar terpisah dengan tabel dokumen
pendaftar: { id, nama, nik, ... }
dokumen: { id, pendaftarId, jenisDokumen, namaFile, pathFile, status, ... }
```

### After (Tabel Terintegrasi) ✅
```sql
-- Semua data dokumen langsung di tabel pendaftar
pendaftar: { 
  id, nama, nik, ...,
  aktaKelahiran_nama, aktaKelahiran_path, aktaKelahiran_ukuran, aktaKelahiran_status,
  kartuKeluarga_nama, kartuKeluarga_path, kartuKeluarga_ukuran, kartuKeluarga_status,
  fotoSiswa_nama, fotoSiswa_path, fotoSiswa_ukuran, fotoSiswa_status
}
```

## ✅ Keuntungan Struktur Baru

### 1. **Query Performance** 
- ❌ Before: `JOIN` antara pendaftar dan dokumen
- ✅ After: Single table query langsung

### 2. **Data Consistency**
- ❌ Before: Risk of orphan documents 
- ✅ After: Dokumen always attached to pendaftar

### 3. **Code Simplicity**
- ❌ Before: Complex relation management
- ✅ After: Direct field access

### 4. **Database Optimization**
- ❌ Before: Multiple tables, indexes, relations
- ✅ After: Single table dengan columns langsung

## 🚀 Implementation Changes

### 1. **Schema Prisma Update**
```prisma
model Pendaftar {
  // ... existing fields
  
  // Dokumen fields langsung di tabel
  aktaKelahiran_nama      String?
  aktaKelahiran_path      String?
  aktaKelahiran_ukuran    Int?
  aktaKelahiran_status    String? @default("pending")
  
  kartuKeluarga_nama      String?
  kartuKeluarga_path      String?
  kartuKeluarga_ukuran    Int?
  kartuKeluarga_status    String? @default("pending")
  
  fotoSiswa_nama          String?
  fotoSiswa_path          String?
  fotoSiswa_ukuran        Int?
  fotoSiswa_status        String? @default("pending")
  
  // Relations (dokumen model dihapus)
  orangTua OrangTua[]
}

// model Dokumen { } ❌ DELETED
```

### 2. **API Pendaftaran Update**
```typescript
// Before: Create pendaftar + create multiple dokumen
await tx.pendaftar.create({ data: pendaftarData })
await tx.dokumen.createMany({ data: dokumenArray })

// After: Create pendaftar with dokumen fields directly
await tx.pendaftar.create({ 
  data: {
    ...pendaftarData,
    aktaKelahiran_nama: files.akta_kelahiran.name,
    aktaKelahiran_path: dokumenPaths[0],
    aktaKelahiran_ukuran: files.akta_kelahiran.size,
    aktaKelahiran_status: 'pending',
    // ... other dokumen fields
  }
})
```

### 3. **Admin API Update**
```typescript
// Before: Include dokumen with relations
include: { 
  orangTua: true,
  dokumen: { select: { id: true, jenisDokumen: true, status: true } },
  _count: { select: { dokumen: true } }
}

// After: Transform data to include dokumen count and array
const transformedPendaftar = pendaftar.map(p => ({
  ...p,
  _count: {
    dokumen: [p.aktaKelahiran_nama, p.kartuKeluarga_nama, p.fotoSiswa_nama].filter(Boolean).length
  },
  dokumen: [
    p.aktaKelahiran_nama && { id: `${p.id}-akta`, jenisDokumen: 'akta_kelahiran', ... },
    p.kartuKeluarga_nama && { id: `${p.id}-kk`, jenisDokumen: 'kartu_keluarga', ... },
    p.fotoSiswa_nama && { id: `${p.id}-foto`, jenisDokumen: 'foto_siswa', ... }
  ].filter(Boolean)
}))
```

### 4. **Status Update Enhancement**
```typescript
// Added dokumen-specific status updates
export async function PUT(request: NextRequest) {
  const { id, status, dokumenType, dokumenStatus } = await request.json()
  
  let updateData: any = { updatedAt: new Date() }
  
  // Update specific dokumen status
  if (dokumenType && dokumenStatus) {
    switch(dokumenType) {
      case 'akta_kelahiran':
        updateData.aktaKelahiran_status = dokumenStatus
        break
      // ... other cases
    }
  }
}
```

## 📊 Sample Data Structure

### Data Lengkap (Ahmad) ✅
```json
{
  "nama": "Ahmad Fajar Ramadhan",
  "aktaKelahiran_nama": "akta_ahmad.pdf",
  "aktaKelahiran_status": "approved",
  "kartuKeluarga_nama": "kk_ahmad.pdf", 
  "kartuKeluarga_status": "approved",
  "fotoSiswa_nama": "foto_ahmad.jpg",
  "fotoSiswa_status": "approved"
}
// _count.dokumen = 3
```

### Data Parsial (Aisyah) ⚠️
```json
{
  "nama": "Aisyah Nur Fitri",
  "aktaKelahiran_nama": "akta_aisyah.pdf",
  "aktaKelahiran_status": "pending",
  "kartuKeluarga_nama": null,
  "fotoSiswa_nama": null
}
// _count.dokumen = 1
```

## 🔧 Compatibility Layer

### Frontend Interface Tetap Sama
```typescript
// Interface di admin panel tidak berubah
interface PendaftarData {
  dokumen: { id: string, jenisDokumen: string, status: string }[]
  _count: { dokumen: number }
}
```

### API Response Backward Compatible
- Frontend tetap terima format array `dokumen[]`
- Backend transform dari columns ke array format
- Tidak perlu ubah UI components

## ⚡ Performance Improvements

### Query Efficiency
```sql
-- Before: JOIN query
SELECT p.*, d.* FROM pendaftar p 
LEFT JOIN dokumen d ON p.id = d.pendaftarId

-- After: Simple SELECT
SELECT * FROM pendaftar
```

### Database Metrics
- ✅ **Reduced Tables**: 3 tables → 2 tables
- ✅ **Simplified Relations**: No more dokumen foreign key
- ✅ **Faster Queries**: Direct column access vs JOINs
- ✅ **Better Indexing**: Single table indexes

## 🧪 Testing Results

### API Performance
- ✅ `/api/admin/pendaftar` - Faster response times
- ✅ `/api/pendaftaran` - Simplified transaction
- ✅ Dokumen counting - Direct field counting

### Data Integrity
- ✅ **No Orphan Documents**: Dokumen terikat dengan pendaftar
- ✅ **Atomic Operations**: Single record update
- ✅ **Consistent State**: Semua dokumen info dalam satu row

### UI/UX Consistency  
- ✅ **Admin Panel**: Tampilan tetap sama
- ✅ **Upload Form**: Berfungsi normal
- ✅ **Status Update**: Dokumen individual updates
- ✅ **Statistics**: Counting dokumen lengkap akurat

## 📈 Migration Summary

### Database Changes
1. ✅ Added dokumen columns to `pendaftar` table
2. ✅ Removed `dokumen` table completely
3. ✅ Updated all foreign key relations
4. ✅ Reset database dengan struktur baru

### Code Changes  
1. ✅ Updated Prisma schema
2. ✅ Refactored pendaftaran API
3. ✅ Modified admin API with transform layer
4. ✅ Updated seed data structure
5. ✅ Enhanced status update functionality

### Benefits Achieved
- 🚀 **Better Performance**: Single table queries
- 🔧 **Simpler Maintenance**: Less complex relations  
- 📊 **Clearer Data Model**: Dokumen as pendaftar properties
- ⚡ **Faster Development**: Direct field access

---

## 🎉 Status: COMPLETE ✅

**Refactor dokumen ke tabel pendaftar berhasil dengan sempurna!**

- ✅ Database structure simplified
- ✅ API performance improved  
- ✅ Code complexity reduced
- ✅ Data consistency enhanced
- ✅ UI/UX preserved
- ✅ Sample data updated

**Sistem PPDB sekarang memiliki struktur database yang lebih optimal dan maintainable! 📊🚀**