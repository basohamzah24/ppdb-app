import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Generate nomor pendaftaran unik
function generateNoPendaftaran(): string {
  const year = new Date().getFullYear().toString().slice(-2)
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const timestamp = Date.now().toString().slice(-6)
  return `PPDB${year}${month}${timestamp}`
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validasi data wajib
    const requiredFields = ['nama', 'nik', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'alamat', 'agama', 'nama_ayah', 'nama_ibu', 'no_telp', 'jalur_pendaftaran']
    
    for (const field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === '') {
        return NextResponse.json(
          { error: `Field ${field} wajib diisi` },
          { status: 400 }
        )
      }
    }

    // Validasi NIK (16 digit)
    if (!/^\d{16}$/.test(data.nik)) {
      return NextResponse.json(
        { error: 'NIK harus terdiri dari 16 digit angka' },
        { status: 400 }
      )
    }

    // Cek apakah NIK sudah terdaftar
    const existingPendaftar = await prisma.pendaftar.findFirst({
      where: {
        nik: data.nik
      }
    })

    if (existingPendaftar) {
      return NextResponse.json(
        { error: 'NIK sudah terdaftar sebelumnya' },
        { status: 409 }
      )
    }

    // Generate nomor pendaftaran
    const noPendaftaran = generateNoPendaftaran()

    // Parse tanggal lahir
    const tanggalLahir = new Date(data.tanggal_lahir)
    if (isNaN(tanggalLahir.getTime())) {
      return NextResponse.json(
        { error: 'Format tanggal lahir tidak valid' },
        { status: 400 }
      )
    }

    // Mulai transaksi database
    const result = await prisma.$transaction(async (tx) => {
      // Buat data pendaftar
      const pendaftar = await tx.pendaftar.create({
        data: {
          noPendaftaran,
          nama: data.nama,
          nik: data.nik,
          tempatLahir: data.tempat_lahir,
          tanggalLahir: tanggalLahir,
          jenisKelamin: data.jenis_kelamin,
          agama: data.agama,
          anakKe: data.anak_ke || null,
          jumlahSaudara: data.jumlah_saudara || null,
          alamat: data.alamat,
          jalurPendaftaran: data.jalur_pendaftaran,
          asalSekolah: data.asal_sekolah || null,
          prestasi: data.prestasi || null,
          statusPendaftaran: 'draft'
        }
      })

      // Buat data orang tua
      await tx.orangTua.create({
        data: {
          pendaftarId: pendaftar.id,
          namaAyah: data.nama_ayah,
          pekerjaanAyah: data.pekerjaan_ayah || null,
          namaIbu: data.nama_ibu,
          pekerjaanIbu: data.pekerjaan_ibu || null,
          noTelp: data.no_telp,
          email: data.email || null,
          alamatOrtu: data.alamat_ortu || null
        }
      })

      return pendaftar
    })

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil!',
      data: {
        id: result.id,
        noPendaftaran: result.noPendaftaran,
        nama: result.nama,
        status: result.statusPendaftaran
      }
    })

  } catch (error) {
    console.error('Error during registration:', error)
    
    // Handle Prisma unique constraint error
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Data sudah terdaftar sebelumnya' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Endpoint untuk mendapatkan statistik pendaftaran
    const stats = await prisma.pendaftar.groupBy({
      by: ['statusPendaftaran'],
      _count: {
        id: true
      }
    })

    const totalPendaftar = await prisma.pendaftar.count()

    return NextResponse.json({
      success: true,
      data: {
        total: totalPendaftar,
        statistics: stats
      }
    })

  } catch (error) {
    console.error('Error fetching registration stats:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data statistik' },
      { status: 500 }
    )
  }
}