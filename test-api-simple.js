// Test API endpoint tanpa database
// Test file: test-api-simple.js

const testData = {
  nama_lengkap: "Test User",
  nisn: "1234567890",
  email: "test@email.com",
  asal_sekolah: "SMP Test",
  jalur_pendaftaran: "Zonasi"
};

console.log("=== Testing PPDB API (Simple) ===");
console.log("Test data:", JSON.stringify(testData, null, 2));

// Validate data format
function validateForm(data) {
  const { nama_lengkap, nisn, email, asal_sekolah, jalur_pendaftaran } = data;
  
  if (!nama_lengkap || !nisn || !email || !asal_sekolah || !jalur_pendaftaran) {
    return 'Semua field harus diisi';
  }
  
  // Validasi NISN (10 digit)
  if (!/^\d{10}$/.test(nisn)) {
    return 'NISN harus terdiri dari 10 digit angka';
  }
  
  // Validasi email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Format email tidak valid';
  }
  
  // Validasi jalur pendaftaran
  const validJalur = ['Zonasi', 'Prestasi', 'Afirmasi'];
  if (!validJalur.includes(jalur_pendaftaran)) {
    return 'Jalur pendaftaran tidak valid';
  }
  
  return null;
}

const validationResult = validateForm(testData);
if (validationResult) {
  console.log("❌ Validation failed:", validationResult);
} else {
  console.log("✅ Validation passed!");
}

console.log("\n=== Manual Test Instructions ===");
console.log("1. Pastikan server berjalan: npm run dev");
console.log("2. Buka browser: http://localhost:3000");
console.log("3. Klik 'Daftar Sekarang'");
console.log("4. Isi form dengan data test di atas");
console.log("5. Klik 'Daftar Sekarang' untuk submit");
console.log("\n=== API Test URLs ===");
console.log("- GET: http://localhost:3000/api/pendaftar");
console.log("- POST: http://localhost:3000/api/pendaftar (dengan JSON body)");