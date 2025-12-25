import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const jalur = searchParams.get('jalur') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.PendaftarWhereInput = {}

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { noPendaftaran: { contains: search, mode: 'insensitive' } },
        { nik: { contains: search } }
      ]
    }

    if (status) {
      where.statusPendaftaran = status
    }

    if (jalur) {
      where.jalurPendaftaran = jalur
    }

    console.log('Fetching pendaftar with filters:', { where, page, limit })

    // Get pendaftar with pagination
    const [pendaftar, total] = await Promise.all([
      prisma.pendaftar.findMany({
        where,
        include: {
          orangTua: true
        },
        orderBy: {
          tanggalDaftar: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.pendaftar.count({ where })
    ])

    // Transform data to include dokumen count and array for consistency
    const transformedPendaftar = pendaftar.map(p => ({
      ...p,
      _count: {
        dokumen: [p.aktaKelahiran_nama, p.kartuKeluarga_nama, p.fotoSiswa_nama].filter(Boolean).length
      },
      dokumen: [
        p.aktaKelahiran_nama && {
          id: `${p.id}-akta`,
          jenisDokumen: 'akta_kelahiran',
          namaFile: p.aktaKelahiran_nama,
          status: p.aktaKelahiran_status || 'pending'
        },
        p.kartuKeluarga_nama && {
          id: `${p.id}-kk`,
          jenisDokumen: 'kartu_keluarga',
          namaFile: p.kartuKeluarga_nama,
          status: p.kartuKeluarga_status || 'pending'
        },
        p.fotoSiswa_nama && {
          id: `${p.id}-foto`,
          jenisDokumen: 'foto_siswa',
          namaFile: p.fotoSiswa_nama,
          status: p.fotoSiswa_status || 'pending'
        }
      ].filter(Boolean)
    }))

    const totalPages = Math.ceil(total / limit)

    console.log(`✅ Found ${transformedPendaftar.length} pendaftar (${total} total, page ${page}/${totalPages})`)

    return NextResponse.json({
      success: true,
      data: transformedPendaftar,
      pagination: {
        current: page,
        total: totalPages,
        totalRecords: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('❌ Error fetching pendaftar:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data pendaftar',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, keterangan, dokumenType, dokumenStatus } = await request.json()

    console.log('Updating pendaftar:', { id, status, keterangan, dokumenType, dokumenStatus })

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID harus diisi' },
        { status: 400 }
      )
    }

    const updateData: {
      updatedAt: Date;
      statusPendaftaran?: string;
      aktaKelahiran_status?: string;
      kartuKeluarga_status?: string;
      fotoSiswa_status?: string;
    } = { updatedAt: new Date() }

    // Update status pendaftaran
    if (status) {
      updateData.statusPendaftaran = status
    }

    // Update status dokumen spesifik
    if (dokumenType && dokumenStatus) {
      switch(dokumenType) {
        case 'akta_kelahiran':
          updateData.aktaKelahiran_status = dokumenStatus
          break
        case 'kartu_keluarga':
          updateData.kartuKeluarga_status = dokumenStatus
          break
        case 'foto_siswa':
          updateData.fotoSiswa_status = dokumenStatus
          break
      }
    }

    const updatedPendaftar = await prisma.pendaftar.update({
      where: { id },
      data: updateData,
      include: {
        orangTua: true
      }
    })

    console.log('✅ Pendaftar updated:', updatedPendaftar.noPendaftaran)

    return NextResponse.json({
      success: true,
      data: updatedPendaftar,
      message: status ? `Status pendaftar berhasil diubah menjadi ${status}` : 'Dokumen berhasil diupdate'
    })

  } catch (error) {
    console.error('❌ Error updating pendaftar:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengupdate status pendaftar',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID pendaftar harus diisi' },
        { status: 400 }
      )
    }

    console.log('Deleting pendaftar:', id)

    // Delete pendaftar (cascade will handle related records)
    await prisma.pendaftar.delete({
      where: { id }
    })

    console.log('✅ Pendaftar deleted successfully')

    return NextResponse.json({
      success: true,
      message: 'Pendaftar berhasil dihapus'
    })

  } catch (error) {
    console.error('❌ Error deleting pendaftar:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal menghapus pendaftar',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}