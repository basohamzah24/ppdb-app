// Enhanced Prisma client dengan retry dan fallback connection
import { PrismaClient } from '@prisma/client'

class PrismaManager {
  private static instance: PrismaClient | null = null
  private static isConnecting = false

  static async getInstance(): Promise<PrismaClient> {
    if (this.instance) {
      return this.instance
    }

    if (this.isConnecting) {
      // Wait for ongoing connection
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return this.instance!
    }

    this.isConnecting = true

    try {
      // Try pooler connection first
      console.log('🔄 Attempting pooler connection...')
      this.instance = new PrismaClient()
      await this.instance.$connect()
      console.log('✅ Pooler connection successful')
      
    } catch (error) {
      console.warn('⚠️ Pooler connection failed, trying direct connection...')
      
      if (this.instance) {
        await this.instance.$disconnect()
      }

      // Fallback to direct connection
      this.instance = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DIRECT_URL
          }
        }
      })
      
      await this.instance.$connect()
      console.log('✅ Direct connection successful')
    } finally {
      this.isConnecting = false
    }

    return this.instance
  }

  static async disconnect() {
    if (this.instance) {
      await this.instance.$disconnect()
      this.instance = null
    }
  }
}

// Export the manager for use in API routes
export default PrismaManager

// Helper function for API routes
export async function getPrismaClient(): Promise<PrismaClient> {
  return await PrismaManager.getInstance()
}

// Graceful shutdown
if (process.env.NODE_ENV !== 'production') {
  process.on('beforeExit', async () => {
    await PrismaManager.disconnect()
  })
  
  process.on('SIGINT', async () => {
    await PrismaManager.disconnect()
    process.exit(0)
  })
}