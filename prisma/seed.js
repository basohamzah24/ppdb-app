const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding data untuk PPDB...')
  
  // Hapus semua data lama jika ada
  await prisma.dokumen.deleteMany()
  await prisma.orangTua.deleteMany()
  await prisma.pendaftar.deleteMany()
  
  console.log('✅ Database berhasil dibersihkan dan siap untuk sistem pendaftaran!')
  console.log('📋 Schema sekarang hanya memiliki 3 tabel:')
  console.log('  1. Pendaftar - Data calon siswa')
  console.log('  2. OrangTua - Data orang tua/wali')
  console.log('  3. Dokumen - File yang diupload')
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })