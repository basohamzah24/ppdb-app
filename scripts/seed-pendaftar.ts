import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedPendaftar() {
  console.log('🌱 Seeding sample pendaftar data...')

  try {
    // Sample pendaftar data
    const pendaftarData = [
      {
        id: 'pdft-001',
        noPendaftaran: 'PPDB2024-001',
        nama: 'Ahmad Fajar Ramadhan',
        nik: '3201234567890123',
        tempatLahir: 'Jakarta',
        tanggalLahir: new Date('2009-05-15'),
        jenisKelamin: 'Laki-laki',
        agama: 'Islam',
        alamat: 'Jl. Merdeka No. 123, Jakarta Pusat',
        jalurPendaftaran: 'reguler',
        asalSekolah: 'SD Negeri 01 Jakarta',
        statusPendaftaran: 'submit',
        tanggalDaftar: new Date(),
        
        // Dokumen
        aktaKelahiran_nama: 'akta_ahmad.pdf',
        aktaKelahiran_path: '/uploads/dokumen/akta_ahmad.pdf',
        aktaKelahiran_ukuran: 512000,
        aktaKelahiran_status: 'approved',
        
        kartuKeluarga_nama: 'kk_ahmad.pdf',
        kartuKeluarga_path: '/uploads/dokumen/kk_ahmad.pdf',
        kartuKeluarga_ukuran: 256000,
        kartuKeluarga_status: 'approved',
        
        fotoSiswa_nama: 'foto_ahmad.jpg',
        fotoSiswa_path: '/uploads/dokumen/foto_ahmad.jpg',
        fotoSiswa_ukuran: 128000,
        fotoSiswa_status: 'approved',
        orangTua: {
          create: {
            namaAyah: 'Budi Ramadhan',
            namaIbu: 'Siti Rahayu',
            noTelp: '081234567890',
            email: 'budi.ramadhan@gmail.com'
          }
        }
      },
      {
        id: 'pdft-002',
        noPendaftaran: 'PPDB2024-002',
        nama: 'Sari Indah Permata',
        nik: '3201234567890124',
        tempatLahir: 'Bandung',
        tanggalLahir: new Date('2009-08-22'),
        jenisKelamin: 'Perempuan',
        agama: 'Islam',
        alamat: 'Jl. Sudirman No. 456, Bandung',
        jalurPendaftaran: 'prestasi',
        asalSekolah: 'SD Negeri 02 Bandung',
        statusPendaftaran: 'review',
        tanggalDaftar: new Date(Date.now() - 24 * 60 * 60 * 1000),
        
        // Dokumen
        aktaKelahiran_nama: 'akta_sari.pdf',
        aktaKelahiran_path: '/uploads/dokumen/akta_sari.pdf',
        aktaKelahiran_ukuran: 512000,
        aktaKelahiran_status: 'approved',
        
        kartuKeluarga_nama: 'kk_sari.pdf',
        kartuKeluarga_path: '/uploads/dokumen/kk_sari.pdf',
        kartuKeluarga_ukuran: 256000,
        kartuKeluarga_status: 'approved',
        
        fotoSiswa_nama: 'foto_sari.jpg',
        fotoSiswa_path: '/uploads/dokumen/foto_sari.jpg',
        fotoSiswa_ukuran: 128000,
        fotoSiswa_status: 'pending',
        orangTua: {
          create: {
            namaAyah: 'Andi Permata',
            namaIbu: 'Sri Wahyuni',
            noTelp: '081234567891',
            email: 'andi.permata@yahoo.com'
          }
        }
      },
      {
        id: 'pdft-003',
        noPendaftaran: 'PPDB2024-003',
        nama: 'Muhammad Rizki Pratama',
        nik: '3201234567890125',
        tempatLahir: 'Surabaya',
        tanggalLahir: new Date('2009-12-03'),
        jenisKelamin: 'Laki-laki',
        agama: 'Islam',
        alamat: 'Jl. Pemuda No. 789, Surabaya',
        jalurPendaftaran: 'zonasi',
        asalSekolah: 'SD Negeri 03 Surabaya',
        statusPendaftaran: 'accepted',
        tanggalDaftar: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        
        // Dokumen
        aktaKelahiran_nama: 'akta_rizki.pdf',
        aktaKelahiran_path: '/uploads/dokumen/akta_rizki.pdf',
        aktaKelahiran_ukuran: 512000,
        aktaKelahiran_status: 'approved',
        
        kartuKeluarga_nama: 'kk_rizki.pdf',
        kartuKeluarga_path: '/uploads/dokumen/kk_rizki.pdf',
        kartuKeluarga_ukuran: 256000,
        kartuKeluarga_status: 'approved',
        
        fotoSiswa_nama: 'foto_rizki.jpg',
        fotoSiswa_path: '/uploads/dokumen/foto_rizki.jpg',
        fotoSiswa_ukuran: 128000,
        fotoSiswa_status: 'approved',
        orangTua: {
          create: {
            namaAyah: 'Rizal Pratama',
            namaIbu: 'Dewi Sartika',
            noTelp: '081234567892',
            email: 'rizal.pratama@gmail.com'
          }
        }
      },
      {
        id: 'pdft-004',
        noPendaftaran: 'PPDB2024-004',
        nama: 'Aisyah Nur Fitri',
        nik: '3201234567890126',
        tempatLahir: 'Yogyakarta',
        tanggalLahir: new Date('2009-03-17'),
        jenisKelamin: 'Perempuan',
        agama: 'Islam',
        alamat: 'Jl. Malioboro No. 321, Yogyakarta',
        jalurPendaftaran: 'reguler',
        asalSekolah: 'SD Negeri 04 Yogyakarta',
        statusPendaftaran: 'draft',
        tanggalDaftar: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        
        // Dokumen (hanya akta, belum lengkap)
        aktaKelahiran_nama: 'akta_aisyah.pdf',
        aktaKelahiran_path: '/uploads/dokumen/akta_aisyah.pdf',
        aktaKelahiran_ukuran: 512000,
        aktaKelahiran_status: 'pending',
        orangTua: {
          create: {
            namaAyah: 'Ahmad Fitri',
            namaIbu: 'Nur Hasanah',
            noTelp: '081234567893'
          }
        }
      },
      {
        id: 'pdft-005',
        noPendaftaran: 'PPDB2024-005',
        nama: 'Kevin Pratama Wijaya',
        nik: '3201234567890127',
        tempatLahir: 'Medan',
        tanggalLahir: new Date('2009-07-09'),
        jenisKelamin: 'Laki-laki',
        agama: 'Kristen',
        alamat: 'Jl. Gatot Subroto No. 654, Medan',
        jalurPendaftaran: 'prestasi',
        asalSekolah: 'SD Swasta 01 Medan',
        statusPendaftaran: 'rejected',
        tanggalDaftar: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        
        // Dokumen (2 dari 3, belum lengkap)
        aktaKelahiran_nama: 'akta_kevin.pdf',
        aktaKelahiran_path: '/uploads/dokumen/akta_kevin.pdf',
        aktaKelahiran_ukuran: 512000,
        aktaKelahiran_status: 'rejected',
        
        kartuKeluarga_nama: 'kk_kevin.pdf',
        kartuKeluarga_path: '/uploads/dokumen/kk_kevin.pdf',
        kartuKeluarga_ukuran: 256000,
        kartuKeluarga_status: 'approved',
        orangTua: {
          create: {
            namaAyah: 'Robert Wijaya',
            namaIbu: 'Linda Pratama',
            noTelp: '081234567894',
            email: 'robert.wijaya@hotmail.com'
          }
        }
      }
    ]

    console.log('📝 Creating pendaftar records...')

    // Create each pendaftar using individual creates to handle relations properly
    for (const data of pendaftarData) {
      const existing = await prisma.pendaftar.findUnique({
        where: { id: data.id }
      })

      if (!existing) {
        await prisma.pendaftar.create({
          data
        })
        console.log(`✅ Created pendaftar: ${data.nama} (${data.noPendaftaran})`)
      } else {
        console.log(`⚠️ Pendaftar ${data.nama} already exists, skipping...`)
      }
    }

    console.log('🎉 Sample pendaftar data seeding completed!')

    // Show summary
    const summary = await prisma.pendaftar.groupBy({
      by: ['statusPendaftaran'],
      _count: {
        statusPendaftaran: true
      }
    })

    console.log('\n📊 Pendaftar Summary:')
    summary.forEach(item => {
      console.log(`   ${item.statusPendaftaran}: ${item._count.statusPendaftaran}`)
    })

    // Count documents directly from pendaftar table
    const dokumenStats = await prisma.pendaftar.findMany({
      select: {
        aktaKelahiran_nama: true,
        kartuKeluarga_nama: true,
        fotoSiswa_nama: true
      }
    })

    const totalDokumen = dokumenStats.reduce((total, p) => {
      return total + [p.aktaKelahiran_nama, p.kartuKeluarga_nama, p.fotoSiswa_nama].filter(Boolean).length
    }, 0)

    console.log(`   Total dokumen uploaded: ${totalDokumen}`)

  } catch (error) {
    console.error('❌ Error seeding pendaftar:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedPendaftar()