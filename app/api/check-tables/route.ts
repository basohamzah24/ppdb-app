import { NextResponse } from 'next/server'
import { checkExistingTables, getTableCounts, testDatabaseConnection } from '@/lib/prisma'

export async function GET() {
  try {
    // Test koneksi database
    const isConnected = await testDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Cek tabel yang ada
    const tables = await checkExistingTables()
    
    // Cek jumlah data di setiap tabel
    const tableCounts = await getTableCounts()

    return NextResponse.json({
      success: true,
      message: 'Database tables retrieved successfully',
      data: {
        tableCount: tables.length,
        tables: tables,
        rowCounts: tableCounts
      }
    })

  } catch (error) {
    console.error('Check tables API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

