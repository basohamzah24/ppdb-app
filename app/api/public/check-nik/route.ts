import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nik = searchParams.get('nik')

    if (!nik) {
      return NextResponse.json(
        { error: 'NIK is required' }, 
        { status: 400 }
      )
    }

    if (nik.length !== 16) {
      return NextResponse.json(
        { error: 'NIK must be 16 digits' }, 
        { status: 400 }
      )
    }

    // Check if NIK exists in pendaftar table
    const existingPendaftar = await prisma.pendaftar.findFirst({
      where: {
        nik: nik
      },
      select: {
        id: true,
        nama: true,
        nik: true,
        noPendaftaran: true,
        statusPendaftaran: true
      }
    })

    if (existingPendaftar) {
      return NextResponse.json({
        exists: true,
        data: {
          nama: existingPendaftar.nama,
          nik: existingPendaftar.nik,
          no_registrasi: existingPendaftar.noPendaftaran,
          status: existingPendaftar.statusPendaftaran
        }
      })
    } else {
      return NextResponse.json({
        exists: false,
        data: null
      })
    }

  } catch (error) {
    console.error('Error checking NIK:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}