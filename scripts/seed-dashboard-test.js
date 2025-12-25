// Script untuk menambahkan data sample untuk testing dashboard
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedTestData() {
  try {
    console.log('🌱 Adding test data for dashboard...')

    // Buat data pendaftar sample
    const testPendaftar = []
    
    for (let i = 1; i <= 10; i++) {
      const pendaftar = await prisma.pendaftar.create({
        data: {
          noPendaftaran: `PPDB2025${String(i).padStart(3, '0')}`,
          nama: `Siswa Test ${i}`,
          nik: `32010${String(i).padStart(11, '0')}`,
          tempatLahir: `Jakarta`,
          tanggalLahir: new Date(`200${i % 5 + 5}-0${(i % 12) + 1}-01`),
          jenisKelamin: i % 2 === 0 ? 'Perempuan' : 'Laki-laki',
          agama: 'Islam',
          anakKe: String(i % 3 + 1),
          jumlahSaudara: String(i % 4 + 1),
          alamat: `Jalan Test ${i}, Jakarta Pusat`,
          jalurPendaftaran: i % 3 === 0 ? 'prestasi' : 'reguler',
          asalSekolah: `TK Test ${i}`,
          statusPendaftaran: i <= 3 ? 'submit' : i <= 7 ? 'review' : 'draft',
          tanggalDaftar: new Date(Date.now() - (i * 24 * 60 * 60 * 1000))
        }
      })

      // Tambah data orang tua
      await prisma.orangTua.create({
        data: {
          pendaftarId: pendaftar.id,
          namaAyah: `Ayah Test ${i}`,
          pekerjaanAyah: 'Karyawan Swasta',
          namaIbu: `Ibu Test ${i}`,
          pekerjaanIbu: 'Ibu Rumah Tangga',
          noTelp: `0812345678${String(i).padStart(2, '0')}`,
          email: `ortu${i}@test.com`,
          alamatOrtu: `Jalan Test ${i}, Jakarta Pusat`
        }
      })

      // Tambah dokumen (beberapa lengkap, beberapa belum)
      const dokumenTypes = ['foto', 'ijazah', 'kk', 'akta_lahir']
      const jumlahDokumen = i <= 5 ? 4 : Math.floor(Math.random() * 3) + 1

      for (let j = 0; j < jumlahDokumen; j++) {
        await prisma.dokumen.create({
          data: {
            pendaftarId: pendaftar.id,
            jenisDokumen: dokumenTypes[j],
            namaFile: `dokumen_${dokumenTypes[j]}_${i}.pdf`,
            ukuranFile: 1024 * (100 + i * 10),
            pathFile: `/uploads/dokumen_${dokumenTypes[j]}_${i}.pdf`,
            status: j < 2 ? 'approved' : 'pending'
          }
        })
      }

      testPendaftar.push(pendaftar)
    }

    // Tambah PPDB Settings
    await prisma.pPDBSettings.upsert({
      where: { id: '1' },
      update: {
        tahunAjaran: '2025/2026',
        statusPendaftaran: 'buka',
        tanggalBuka: new Date('2025-01-01'),
        tanggalTutup: new Date('2025-03-31'),
        kuotaSiswa: 120,
        persyaratan: [
          'Usia minimal 6 tahun pada 1 Juli 2025',
          'Memiliki akta kelahiran',
          'Melengkapi dokumen yang dipersyaratkan'
        ],
        alurPendaftaran: [
          'Registrasi online',
          'Upload dokumen',
          'Verifikasi berkas',
          'Pengumuman hasil'
        ]
      },
      create: {
        id: '1',
        tahunAjaran: '2025/2026',
        statusPendaftaran: 'buka',
        tanggalBuka: new Date('2025-01-01'),
        tanggalTutup: new Date('2025-03-31'),
        kuotaSiswa: 120,
        persyaratan: [
          'Usia minimal 6 tahun pada 1 Juli 2025',
          'Memiliki akta kelahiran',
          'Melengkapi dokumen yang dipersyaratkan'
        ],
        alurPendaftaran: [
          'Registrasi online',
          'Upload dokumen',
          'Verifikasi berkas',
          'Pengumuman hasil'
        ]
      }
    })

    // Tambah jadwal sample
    const schedules = [
      {
        title: 'Pendaftaran Online Dibuka',
        description: 'Pendaftaran online PPDB dimulai',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-02-28'),
        startTime: '08:00',
        endTime: '16:00',
        location: 'Online',
        type: 'important',
        order: 1,
        createdBy: 'admin'
      },
      {
        title: 'Verifikasi Berkas',
        description: 'Verifikasi berkas pendaftaran oleh admin',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-15'),
        startTime: '08:00',
        endTime: '15:00',
        location: 'Sekolah',
        type: 'regular',
        order: 2,
        createdBy: 'admin'
      },
      {
        title: 'Pengumuman Hasil',
        description: 'Pengumuman hasil seleksi PPDB',
        startDate: new Date('2025-03-20'),
        startTime: '10:00',
        location: 'Website & Sekolah',
        type: 'deadline',
        order: 3,
        createdBy: 'admin'
      }
    ]

    for (const schedule of schedules) {
      await prisma.schedule.create({
        data: schedule
      })
    }

    console.log('✅ Test data added successfully!')
    console.log(`📊 Created ${testPendaftar.length} pendaftar with documents`)
    console.log(`📅 Created ${schedules.length} schedules`)
    console.log('🎯 Dashboard should now show proper statistics')

  } catch (error) {
    console.error('❌ Error seeding test data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTestData()