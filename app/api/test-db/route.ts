import { NextResponse } from 'next/server'
import { prisma, testDatabaseConnection, getDatabaseInfo } from '@/lib/prisma'

// Test koneksi database
export async function GET() {
  try {
    // Test koneksi
    const isConnected = await testDatabaseConnection()
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection failed',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    // Ambil informasi database
    const dbInfo = await getDatabaseInfo()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      database_info: dbInfo,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Endpoint untuk mendapatkan jumlah pendaftar
export async function POST() {
  try {
    const totalPendaftar = await prisma.pendaftar.count()
    
    return NextResponse.json({
      success: true,
      data: {
        total_pendaftar: totalPendaftar
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error getting pendaftar count:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get pendaftar count',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

