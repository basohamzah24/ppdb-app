import { PrismaClient } from '@prisma/client'

// Validate environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

// Singleton pattern untuk Prisma Client dengan konfigurasi modern
declare global {
  var __prisma__: PrismaClient | undefined
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn', 'info'] 
      : ['error'],
    errorFormat: 'pretty',
    datasources: undefined, // Let Prisma handle datasource URLs from schema
  })
}

export const prisma = globalThis.__prisma__ ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma__ = prisma
}

// Function untuk test koneksi database
export async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Function untuk mendapatkan informasi database
export async function getDatabaseInfo() {
  try {
    const result = await prisma.$queryRaw`SELECT version();`
    console.log('📊 Database info:', result)
    return result
  } catch (error) {
    console.error('❌ Failed to get database info:', error)
    throw error
  }
}

// Function untuk mengecek tabel yang ada di database
export async function checkExistingTables() {
  try {
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    ` as Array<{table_name: string}>
    
    console.log('📋 Tables in database:')
    result.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`)
    })
    
    return result.map(table => table.table_name)
  } catch (error) {
    console.error('❌ Failed to check existing tables:', error)
    throw error
  }
}

// Function untuk menghitung jumlah data di setiap tabel
export async function getTableCounts() {
  try {
    const tables = await checkExistingTables()
    const counts: Record<string, number> = {}
    
    for (const tableName of tables) {
      const result = await prisma.$queryRawUnsafe(`SELECT COUNT(*) FROM "${tableName}";`) as Array<{count: string}>
      counts[tableName] = parseInt(result[0].count)
    }
    
    console.log('📊 Row counts per table:')
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`${table}: ${count} rows`)
    })
    
    return counts
  } catch (error) {
    console.error('❌ Failed to get table counts:', error)
    throw error
  }
}

