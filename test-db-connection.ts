import { prisma } from './lib/prisma'

async function main() {
  try {
    console.log('🔄 Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Test database info
    const result = await prisma.$queryRaw`SELECT version() as version`
    console.log('📊 Database version:', result)
    
    // Test table existence
    const adminCount = await prisma.admin.count()
    console.log(`👥 Admin records: ${adminCount}`)
    
    // Test query performance
    const start = Date.now()
    await prisma.pendaftar.count()
    const duration = Date.now() - start
    console.log(`⚡ Query performance: ${duration}ms`)
    
    console.log('🎉 All database tests passed!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Database disconnected')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })