# 🧪 Panduan Testing Persistensi Data

## Langkah-langkah Test yang Harus Dilakukan

### ✅ TEST 1: Update Data di Admin Panel

1. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```

2. **Login ke Admin Panel**
   - Buka: http://localhost:3000/admin/login
   - Login dengan akun admin Anda

3. **Buka Halaman Pengaturan**
   - Klik menu "Pengaturan" atau buka: http://localhost:3000/admin/pengaturan

4. **Ubah Data**
   - Ubah **Tahun Ajaran** dari `2025/2022` menjadi `2026/2027`
   - Ubah **Kuota Siswa** dari `0` menjadi `150`
   - Klik tombol **"Simpan Pengaturan"**

5. **Perhatikan Pesan**
   - Harus muncul: ✅ "Data berhasil disimpan ke database! Perubahan sudah permanen."

6. **Cek Console Browser (F12)**
   ```javascript
   Menyimpan pengaturan: {tahunAjaran: "2026/2027", ...}
   Response dari server: {success: true, data: {...}}
   Cache berhasil di-refresh
   ```

7. **Cek Terminal Aplikasi**
   ```
   Menerima request update PPDB settings: {...}
   Data berhasil disimpan ke database: {...}
   ```

---

### ✅ TEST 2: Restart Aplikasi

1. **Stop aplikasi** (di terminal tekan `Ctrl+C`)

2. **Tunggu sampai benar-benar stop**
   ```
   Waiting for file changes...
   Process exited with code 0
   ```

3. **Start ulang aplikasi**
   ```bash
   npm run dev
   ```

4. **Buka Admin Panel lagi**
   - Login ke: http://localhost:3000/admin/pengaturan

5. **VERIFIKASI DATA MASIH ADA**
   - ✅ Tahun Ajaran masih `2026/2027` (BUKAN kembali ke `2025/2022`)
   - ✅ Kuota Siswa masih `150` (BUKAN kembali ke `0`)

**JIKA DATA MASIH ADA = PERSISTENSI BERHASIL! ✅**

---

### ✅ TEST 3: Verifikasi di Halaman Publik

1. **Buka halaman publik**
   - http://localhost:3000
   - http://localhost:3000/informasi
   - http://localhost:3000/jadwal

2. **Perhatikan**
   - Data yang ditampilkan harus sesuai dengan yang diubah di admin
   - Tahun Ajaran harus `2026/2027`
   - Kuota Siswa harus `150`

3. **Refresh halaman berkali-kali** (Ctrl+R atau F5)
   - Data harus tetap sama
   - Tidak kembali ke nilai lama

---

### ✅ TEST 4: Verifikasi dengan Script

1. **Jalankan script verifikasi**
   ```bash
   node scripts/verify-persistence.js
   ```

2. **Hasil yang diharapkan:**
   ```
   ✅ Database connection: OK
   ✅ Read operation: OK
   ✅ Write operation: OK
   ✅ Delete operation: OK
   ✅ Data persistence: VERIFIED!
   ```

3. **Cek data PPDB Settings:**
   ```
   ✅ PPDB Settings ditemukan:
      - Tahun Ajaran: 2026/2027  ← Harus nilai baru!
      - Kuota: 150  ← Harus nilai baru!
      - Last Update: [waktu terbaru]
   ```

---

### ✅ TEST 5: Test Multiple Updates

1. **Update data pertama**
   - Tahun Ajaran: `2027/2028`
   - Simpan

2. **Restart aplikasi**

3. **Update data kedua**
   - Tahun Ajaran: `2028/2029`
   - Simpan

4. **Restart aplikasi lagi**

5. **Verifikasi**
   - Data harus `2028/2029` (update terakhir)
   - BUKAN `2027/2028` atau `2026/2027`

---

### ✅ TEST 6: Test Concurrency (Optional)

1. **Buka 2 tab browser**
   - Tab 1: Admin Panel
   - Tab 2: Halaman Publik

2. **Di Tab 1: Ubah data & simpan**

3. **Di Tab 2: Refresh halaman**
   - Data harus langsung ter-update

---

## 📋 Checklist Hasil Test

Centang (✓) jika sudah berhasil:

- [ ] **Test 1:** Bisa update data di admin panel
- [ ] **Test 1:** Muncul pesan sukses setelah save
- [ ] **Test 1:** Console log menampilkan data tersimpan
- [ ] **Test 2:** Data masih ada setelah restart
- [ ] **Test 3:** Data tampil di halaman publik
- [ ] **Test 3:** Data tidak berubah setelah refresh
- [ ] **Test 4:** Script verifikasi berhasil
- [ ] **Test 5:** Update berturut-turut berhasil
- [ ] **Test 6:** Data sinkron di semua tab

---

## 🎯 Kesimpulan

Jika **SEMUA** checklist di atas berhasil (✓), maka:

✅ **Data 100% TERSIMPAN PERMANEN di database**
✅ **Tidak akan hilang setelah restart**
✅ **Perubahan bersifat PERSISTENT**
✅ **System bekerja dengan sempurna**

---

## 🐛 Troubleshooting

### Jika data hilang setelah restart:

1. **Cek koneksi database**
   ```bash
   node scripts/verify-persistence.js
   ```
   - Jika gagal = masalah koneksi database
   - Cek `.env` file, pastikan `DATABASE_URL` benar

2. **Cek console error**
   - Browser Console (F12)
   - Terminal aplikasi
   - Cari error message merah

3. **Cek apakah save berhasil**
   - Harus ada pesan: "✅ Data berhasil disimpan ke database!"
   - Jika tidak ada = save gagal, cek error

4. **Cek Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Test database langsung**
   ```bash
   npm run prisma:studio
   ```
   - Buka tabel `ppdb_settings`
   - Cek apakah data ada

---

## 📞 Support

Jika masih ada masalah:
1. Screenshot error message (browser & terminal)
2. Jalankan: `node scripts/verify-persistence.js`
3. Copy hasil output
4. Tunjukkan ke developer

---

## 🎉 Selamat!

Jika semua test berhasil, sistem Anda sudah **100% AMAN** dan data tidak akan hilang!
