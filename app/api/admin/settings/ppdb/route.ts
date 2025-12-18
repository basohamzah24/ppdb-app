import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Ambil pengaturan PPDB saat ini
export async function GET() {
  try {
    let settings = await prisma.pPDBSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    })

    // Jika belum ada settings, buat default
    if (!settings) {
      settings = await prisma.pPDBSettings.create({
        data: {
          tahunAjaran: '2025/2026',
          statusPendaftaran: 'tutup',
          tanggalBuka: new Date(),
          tanggalTutup: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari dari sekarang
          kuotaSiswa: 100,
          persyaratan: [
            'Fotokopi Akte Kelahiran',
            'Fotokopi Kartu Keluarga',
            'Pas Foto 3x4 sebanyak 3 lembar',
            'Surat Keterangan Sehat dari Dokter'
          ],
          alurPendaftaran: [
            'Daftar online melalui website',
            'Upload dokumen persyaratan',
            'Verifikasi berkas oleh admin',
            'Pengumuman hasil seleksi'
          ],
          informasiTambahan: 'Pendaftaran dilakukan secara online. Pastikan semua dokumen telah disiapkan sebelum mendaftar.'
        }
      })
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Error fetching PPDB settings:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil pengaturan PPDB' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Update pengaturan PPDB
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validasi input
    const {
      tahunAjaran,
      statusPendaftaran,
      tanggalBuka,
      tanggalTutup,
      kuotaSiswa,
      persyaratan,
      alurPendaftaran,
      informasiTambahan
    } = body

    if (!tahunAjaran || !statusPendaftaran || !tanggalBuka || !tanggalTutup) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    // Cek apakah sudah ada settings
    let settings = await prisma.pPDBSettings.findFirst()
    
    if (settings) {
      // Update existing
      settings = await prisma.pPDBSettings.update({
        where: { id: settings.id },
        data: {
          tahunAjaran,
          statusPendaftaran,
          tanggalBuka: new Date(tanggalBuka),
          tanggalTutup: new Date(tanggalTutup),
          kuotaSiswa: parseInt(kuotaSiswa),
          persyaratan: persyaratan || [],
          alurPendaftaran: alurPendaftaran || [],
          informasiTambahan
        }
      })
    } else {
      // Create new
      settings = await prisma.pPDBSettings.create({
        data: {
          tahunAjaran,
          statusPendaftaran,
          tanggalBuka: new Date(tanggalBuka),
          tanggalTutup: new Date(tanggalTutup),
          kuotaSiswa: parseInt(kuotaSiswa),
          persyaratan: persyaratan || [],
          alurPendaftaran: alurPendaftaran || [],
          informasiTambahan
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: settings,
      message: 'Pengaturan PPDB berhasil disimpan'
    })
  } catch (error) {
    console.error('Error updating PPDB settings:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan pengaturan PPDB' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}