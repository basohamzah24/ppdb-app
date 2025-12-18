import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('Dashboard API called') // Debug log
    
    // Test database connection first
    await prisma.$connect()
    console.log('Prisma connected successfully') // Debug log
    
    // Ambil data statistik dari database
    const [
      totalPendaftar,
      pendaftarHariIni,
      pendaftarDenganDokumen
    ] = await Promise.all([
      // Total pendaftar
      prisma.pendaftar.count(),
      
      // Pendaftar hari ini
      prisma.pendaftar.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      
      // Pendaftar yang memiliki dokumen
      prisma.pendaftar.count({
        where: {
          dokumen: {
            some: {}
          }
        }
      })
    ])

    // Hitung dokumen lengkap (minimal 3 dokumen)
    // Ambil semua pendaftar dengan dokumen mereka
    const pendaftarDenganJumlahDokumen = await prisma.pendaftar.findMany({
      select: {
        _count: {
          select: {
            dokumen: true
          }
        }
      }
    })
    
    // Hitung yang memiliki minimal 3 dokumen
    const dokumenLengkap = pendaftarDenganJumlahDokumen.filter(
      pendaftar => pendaftar._count.dokumen >= 3
    ).length

    // Menunggu verifikasi = punya dokumen tapi belum lengkap
    const menungguVerifikasi = Math.max(0, pendaftarDenganDokumen - dokumenLengkap)

    const dashboardData = {
      stats: {
        totalPendaftar,
        pendaftarBaru: pendaftarHariIni,
        dokumenLengkap,
        menungguVerifikasi
      }
    }

    return NextResponse.json(dashboardData, { status: 200 })

  } catch (error) {
    console.error('Dashboard API error:', error)
    
    // Return fallback data jika database error
    const fallbackData = {
      stats: {
        totalPendaftar: 0,
        pendaftarBaru: 0,
        dokumenLengkap: 0,
        menungguVerifikasi: 0
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