// Script test koneksi alternatif dengan DIRECT_URL
// Jalankan dengan: node scripts/test-direct-connection.js

const { PrismaClient } = require('@prisma/client')

// Gunakan DIRECT_URL tanpa pooler
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
})

async function testDirectConnection() {
  console.log('\n🔄 Testing direct connection (bypass pooler)...\n')
  
  try {
    console.log('📡 Connecting to:', process.env.DIRECT_URL?.replace(/:[^:@]*@/, ':***@'))
    
    // Test simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as pg_version;`
    console.log('✅ Direct connection successful!')
    console.log('🕐 Server time:', result[0].current_time)
    console.log('🗃️  PostgreSQL version:', result[0].pg_version)
    
    // Test PPDB Settings table
    console.log('\n📊 Testing PPDB Settings...')
    const settings = await prisma.pPDBSettings.findFirst()
    
    if (settings) {
      console.log('✅ PPDB Settings found:')
      console.log(`   📅 Tahun Ajaran: ${settings.tahunAjaran}`)
      console.log(`   🔓 Status: ${settings.statusPendaftaran}`)
      console.log(`   👥 Kuota: ${settings.kuotaSiswa}`)
      console.log(`   🕐 Last Update: ${settings.updatedAt}`)
    } else {
      console.log('⚠️  No PPDB Settings found (table empty)')
    }
    
    console.log('\n✅ All tests passed! Direct connection working.')
    
  } catch (error) {
    console.error('\n❌ Direct connection failed:', error.message)
    
    if (error.message.includes("Can't reach database server")) {
      console.log('\n💡 Kemungkinan penyebab:')
      console.log('   1. 🌐 Network/Internet issue')
      console.log('   2. 🛡️  Firewall/ISP blocking connection')
      console.log('   3. ⚠️  Neon.tech server maintenance')
      console.log('   4. 🔐 SSL/TLS certificate issue')
      
      console.log('\n🔧 Coba solusi:')
      console.log('   - Tunggu beberapa menit (mungkin maintenance)')
      console.log('   - Coba dari network WiFi lain')
      console.log('   - Gunakan VPN')
      console.log('   - Check https://status.neon.tech')
    }
    
  } finally {
    await prisma.$disconnect()
  }
}

// Test with timeout
const timeoutMs = 30000 // 30 seconds
Promise.race([
  testDirectConnection(),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Connection timeout after 30s')), timeoutMs)
  )
]).catch(error => {
  if (error.message.includes('timeout')) {
    console.error('\n⏰ Connection timeout - server mungkin sedang bermasalah')
  } else {
    console.error('\n❌ Unexpected error:', error.message)
  }
  process.exit(1)
})