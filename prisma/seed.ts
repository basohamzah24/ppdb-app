import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Hash password
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12)
}

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // Use modern upsert pattern instead of delete + create
    console.log('📝 Upserting admin user...')
    
    // Create or update Admin using passwordHash field
    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {
        passwordHash: 'admin123', // Simple password matching our auth system
        role: 'admin',
      },
      create: {
        username: 'admin',
        passwordHash: 'admin123', // Simple password matching our auth system
        role: 'admin',
      }
    })
    console.log('✅ Admin user ready:', admin.username)

    // Create Sample Pendaftar
    const samplePendaftar = [
      {
        nik: '3201234567890123',
        namaLengkap: 'Ahmad Fauzi',
        tempatLahir: 'Luwu Utara',
        tanggalLahir: new Date('2017-05-15'),
        jenisKelamin: 'L',
        alamat: 'Jl. Merdeka No. 123, Sumpira, Luwu Utara',
        asalTK: 'TK Pertiwi Sumpira',
        statusVerifikasi: 'verified',
        statusKelulusan: 'diterima',
        nomorPendaftaran: 'PPDB2024001',
        orangTua: {
          namaAyah: 'Budi Santoso',
          namaIbu: 'Siti Nurhaliza',
          pekerjaanAyah: 'Petani',
          pekerjaanIbu: 'Ibu Rumah Tangga',
          noHP: '081234567890',
          email: 'budi.santoso@email.com'
        }
      },
      {
        nik: '3201234567890124',
        namaLengkap: 'Siti Aminah',
        tempatLahir: 'Luwu Utara',
        tanggalLahir: new Date('2017-08-22'),
        jenisKelamin: 'P',
        alamat: 'Jl. Sudirman No. 45, Sumpira, Luwu Utara',
        asalTK: 'TK Dharma Wanita',
        statusVerifikasi: 'pending',
        statusKelulusan: 'pending',
        nomorPendaftaran: 'PPDB2024002',
        orangTua: {
          namaAyah: 'Ahmad Yusuf',
          namaIbu: 'Fatimah Zahra',
          pekerjaanAyah: 'Wiraswasta',
          pekerjaanIbu: 'Guru',
          noHP: '081234567891',
          email: 'ahmad.yusuf@email.com'
        }
      }
    ]

    for (const data of samplePendaftar) {
      const { orangTua, ...pendaftarData } = data
      
      const pendaftar = await prisma.pendaftar.create({
        data: {
          ...pendaftarData,
          orangTua: {
            create: orangTua
          }
        }
      })

      console.log(`👶 Created pendaftar: ${pendaftar.namaLengkap}`)
    }

    // Create Sample Pengumuman
    await prisma.pengumuman.create({
      data: {
        judul: 'Pembukaan Pendaftaran PPDB Online 2024',
        isi: 'Dengan hormat, kami informasikan bahwa pendaftaran PPDB Online untuk tahun ajaran 2024/2025 telah dibuka.',
        tipe: 'info',
        status: 'published',
        isPinned: true,
        tanggalPublish: new Date(),
        author: 'Admin PPDB'
      }
    })

    console.log('✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })