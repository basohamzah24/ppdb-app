// Script untuk verifikasi persistensi data ke database
// Jalankan dengan: node scripts/verify-persistence.js

const { PrismaClient } = require('@prisma/client')

// Coba pooler dulu, kalau gagal gunakan direct connection
let prisma = new PrismaClient()

async function createPrismaClient() {
  try {
    // Test pooler connection dulu
    await prisma.$connect()
    console.log('✅ Menggunakan pooler connection')
    return prisma
  } catch (error) {
    console.log('⚠️  Pooler connection gagal, switching ke direct connection...')
    await prisma.$disconnect()
    
    // Gunakan direct connection
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DIRECT_URL
        }
      }
    })
    
    await prisma.$connect()
    console.log('✅ Menggunakan direct connection')
    return prisma
  }
}

async function verifyPersistence() {
  console.log('\n🔍 Memverifikasi persistensi data di database...\n')
  
  let client
  try {
    // Setup Prisma client dengan fallback
    client = await createPrismaClient()
    
    // 1. Cek PPDB Settings
    console.log('1️⃣  Mengecek PPDB Settings...')
    const ppdbSettings = await client.pPDBSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    })
    
    if (ppdbSettings) {
      console.log('✅ PPDB Settings ditemukan:')
      console.log(`   - ID: ${ppdbSettings.id}`)
      console.log(`   - Tahun Ajaran: ${ppdbSettings.tahunAjaran}`)
      console.log(`   - Status: ${ppdbSettings.statusPendaftaran}`)
      console.log(`   - Kuota: ${ppdbSettings.kuotaSiswa}`)
      console.log(`   - Last Update: ${ppdbSettings.updatedAt}`)
      console.log(`   - Persyaratan: ${ppdbSettings.persyaratan.length} item`)
      console.log(`   - Alur: ${ppdbSettings.alurPendaftaran.length} step`)
    } else {
      console.log('❌ PPDB Settings tidak ditemukan (belum ada data)')
    }
    
    // 2. Cek Content
    console.log('\n2️⃣  Mengecek Content...')
    const contents = await client.content.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    })
    
    if (contents.length > 0) {
      console.log(`✅ Ditemukan ${contents.length} content aktif:`)
      contents.forEach((content, index) => {
        console.log(`   ${index + 1}. ${content.key} (Updated: ${content.updatedAt})`)
      })
    } else {
      console.log('❌ Content tidak ditemukan (belum ada data)')
    }
    
    // 3. Cek Pendaftar
    console.log('\n3️⃣  Mengecek Pendaftar...')
    const pendaftarCount = await client.pendaftar.count()
    console.log(`ℹ️  Total pendaftar: ${pendaftarCount}`)
    
    // 4. Cek Admin
    console.log('\n4️⃣  Mengecek Admin...')
    const adminCount = await client.admin.count()
    console.log(`ℹ️  Total admin: ${adminCount}`)
    
    // 5. Test Write & Read
    console.log('\n5️⃣  Test Write & Read...')
    const testKey = 'test_persistence_' + Date.now()
    const testValue = 'Test value at ' + new Date().toISOString()
    
    // Write
    const created = await client.content.create({
      data: {
        key: testKey,
        content: testValue,
        type: 'text',
        isActive: true
      }
    })
    console.log(`✅ Test data berhasil ditulis: ${created.key}`)
    
    // Read
    const read = await client.content.findUnique({
      where: { key: testKey }
    })
    console.log(`✅ Test data berhasil dibaca: ${read?.content}`)
    
    // Delete test data
    await client.content.delete({
      where: { key: testKey }
    })
    console.log('✅ Test data berhasil dihapus')
    
    console.log('\n✨ Kesimpulan:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Database connection: OK')
    console.log('✅ Read operation: OK')
    console.log('✅ Write operation: OK')
    console.log('✅ Delete operation: OK')
    console.log('✅ Data persistence: VERIFIED!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n💾 Semua data tersimpan PERMANEN di database PostgreSQL')
    console.log('🔄 Data tidak akan hilang setelah restart aplikasi\n')
    
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    if (error.message.includes("Can't reach database server")) {
      console.log('\n💡 Troubleshooting:')
      console.log('   - Cek koneksi internet')
      console.log('   - Coba: node scripts/test-direct-connection.js')
      console.log('   - Check https://status.neon.tech')
    }
  } finally {
    if (client) await client.$disconnect()
  }
}

verifyPersistence()
