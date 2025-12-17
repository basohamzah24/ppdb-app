import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard API called') // Debug log
    
    // Test database connection first
    await prisma.$connect()
    console.log('Prisma connected successfully') // Debug log
    
    // Ambil total pendaftar dari database
    const totalPendaftar = await prisma.pendaftar.count()

    const dashboardData = {
      stats: {
        totalPendaftar
      }
    }

    return NextResponse.json(dashboardData, { status: 200 })

  } catch (error) {
    console.error('Dashboard API error:', error)
    
    // Return fallback data jika database error
    const fallbackData = {
      stats: {
        totalPendaftar: 0
      }
    }
    
    return NextResponse.json(fallbackData, { status: 200 })
  } finally {
    await prisma.$disconnect()
  }
}



// Method lain tidak diizinkan
export async function POST() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}