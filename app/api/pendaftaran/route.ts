import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Generate nomor pendaftaran unik
function generateNoPendaftaran(): string {
  const year = new Date().getFullYear().toString().slice(-2)
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const timestamp = Date.now().toString().slice(-6)
  return `PPDB${year}${month}${timestamp}`
}

async function saveFile(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Create unique filename
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
  
  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadsDir, { recursive: true })
  
  // Save file
  const filePath = join(uploadsDir, filename)
  await writeFile(filePath, buffer)
  
  return `/uploads/${folder}/${filename}`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const data: Record<string, any> = {}
    const files: Record<string, File> = {}
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files[key] = value
      } else {
        data[key] = value
      }
    }
    
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

    // Validasi dokumen wajib
    const requiredDokumen = ['akta_kelahiran', 'kartu_keluarga', 'foto_siswa']
    for (const dok of requiredDokumen) {
      if (!files[dok]) {
        return NextResponse.json(
          { error: `Dokumen ${dok.replace('_', ' ')} wajib diupload` },
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

    // Save uploaded files
    console.log('📁 Saving uploaded files...')
    const dokumenPaths = await Promise.all([
      saveFile(files.akta_kelahiran, 'dokumen'),
      saveFile(files.kartu_keluarga, 'dokumen'),
      saveFile(files.foto_siswa, 'dokumen'),
    ])

    console.log('✅ Files saved:', dokumenPaths)

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
      // Buat data pendaftar dengan dokumen
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
          statusPendaftaran: 'draft',
          
          // Dokumen fields
          aktaKelahiran_nama: files.akta_kelahiran.name,
          aktaKelahiran_path: dokumenPaths[0],
          aktaKelahiran_ukuran: files.akta_kelahiran.size,
          aktaKelahiran_status: 'pending',
          
          kartuKeluarga_nama: files.kartu_keluarga.name,
          kartuKeluarga_path: dokumenPaths[1],
          kartuKeluarga_ukuran: files.kartu_keluarga.size,
          kartuKeluarga_status: 'pending',
          
          fotoSiswa_nama: files.foto_siswa.name,
          fotoSiswa_path: dokumenPaths[2],
          fotoSiswa_ukuran: files.foto_siswa.size,
          fotoSiswa_status: 'pending'
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