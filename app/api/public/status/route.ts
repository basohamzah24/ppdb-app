import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nik = searchParams.get('nik')

    if (!nik) {
      return NextResponse.json(
        { message: 'NIK is required' }, 
        { status: 400 }
      )
    }

    if (nik.length !== 16) {
      return NextResponse.json(
        { message: 'NIK must be 16 digits' }, 
        { status: 400 }
      )
    }

    // Find pendaftar by NIK
    const pendaftar = await prisma.pendaftar.findFirst({
      where: {
        nik: nik
      },
      select: {
        id: true,
        nama: true,
        nik: true,
        noPendaftaran: true,
        statusPendaftaran: true,
        aktaKelahiran_status: true,
        kartuKeluarga_status: true,
        fotoSiswa_status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!pendaftar) {
      return NextResponse.json(
        { message: 'Pendaftaran dengan NIK tersebut tidak ditemukan' },
        { status: 404 }
      )
    }

    // Transform data to match expected format
    const responseData = {
      nama_lengkap: pendaftar.nama,
      nik: pendaftar.nik,
      no_registrasi: pendaftar.noPendaftaran,
      status: pendaftar.statusPendaftaran,
      status_dokumen: pendaftar.aktaKelahiran_status && pendaftar.kartuKeluarga_status && pendaftar.fotoSiswa_status 
        ? (pendaftar.aktaKelahiran_status === 'approved' && pendaftar.kartuKeluarga_status === 'approved' && pendaftar.fotoSiswa_status === 'approved' ? 'LENGKAP' : 'TIDAK_LENGKAP')
        : 'TIDAK_LENGKAP',
      catatan: null, // Add if this field exists in your schema
      created_at: pendaftar.createdAt,
      updated_at: pendaftar.updatedAt
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error fetching registration status:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
