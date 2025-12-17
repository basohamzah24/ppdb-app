// Test script untuk memastikan koneksi Prisma bekerja
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔄 Testing Prisma connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Prisma connected successfully!')
    
    // Test query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as pg_version;`
    console.log('📊 Database info:', result)
    
    // Test model (jika tabel sudah ada)
    try {
      const count = await prisma.pendaftar.count()
      console.log('👥 Total pendaftar:', count)
    } catch (error) {
      console.log('⚠️  Tabel pendaftar belum ada, jalankan migrasi terlebih dahulu')
      console.error('Error:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    if (error.code) {
      console.error('Error code:', error.code)
    }
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Prisma disconnected')
  }
}

testConnection()