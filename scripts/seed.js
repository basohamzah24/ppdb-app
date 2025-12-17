import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...')

    // Seed SiteContent
    const siteContentData = [
      {
        key: 'hero_title',
        title: 'Hero Title',
        content: 'Selamat Datang di PPDB Online',
        type: 'hero',
        isActive: true
      },
      {
        key: 'hero_subtitle', 
        title: 'Hero Subtitle',
        content: 'SMK Negeri 1 Kota Pendidikan',
        type: 'hero',
        isActive: true
      },
      {
        key: 'hero_description',
        title: 'Hero Description', 
        content: 'Bergabunglah dengan sekolah terbaik dan raih masa depan gemilang bersama kami. Pendidikan berkualitas dengan fasilitas modern dan tenaga pengajar profesional.',
        type: 'hero',
        isActive: true
      },
      {
        key: 'about_title',
        title: 'About Title',
        content: 'Tentang SMK Negeri 1',
        type: 'about',
        isActive: true
      },
      {
        key: 'about_content',
        title: 'About Content',
        content: 'SMK Negeri 1 Kota Pendidikan adalah sekolah menengah kejuruan yang berkomitmen menghasilkan lulusan berkualitas tinggi dengan keahlian yang sesuai kebutuhan industri. Dengan pengalaman lebih dari 25 tahun, kami telah mencetak ribuan alumni yang berhasil di dunia kerja dan pendidikan tinggi.',
        type: 'about',
        isActive: true
      },
      {
        key: 'contact_address',
        title: 'Contact Address',
        content: 'Jl. Pendidikan No. 123, Kelurahan Cerdas, Kecamatan Pintar, Kota Pendidikan 12345',
        type: 'contact',
        isActive: true
      },
      {
        key: 'contact_phone',
        title: 'Contact Phone',
        content: '(021) 1234-5678',
        type: 'contact',
        isActive: true
      },
      {
        key: 'contact_email',
        title: 'Contact Email',
        content: 'ppdb@smkn1kotapendidikan.sch.id',
        type: 'contact',
        isActive: true
      },
      {
        key: 'announcement',
        title: 'Site Announcement',
        content: '🎉 PPDB 2024/2025 telah dibuka! Daftar sekarang dan raih masa depan cemerlang bersama kami.',
        type: 'announcement',
        isActive: true
      }
    ]

    for (const content of siteContentData) {
      await prisma.siteContent.upsert({
        where: { key: content.key },
        update: content,
        create: content
      })
      console.log(`✅ Site content "${content.key}" created/updated`)
    }

    // Seed PPDB Settings
    const ppdbSettingsData = {
      tahunAjaran: '2024/2025',
      tanggalBuka: new Date('2024-01-15T00:00:00Z'),
      tanggalTutup: new Date('2024-07-31T23:59:59Z'),
      kuotaSiswa: 360,
      statusPendaftaran: 'buka',
      persyaratan: [
        'Usia minimal 15 tahun dan maksimal 21 tahun pada tanggal 1 Juli 2024',
        'Lulusan SMP/MTs atau sederajat',
        'Memiliki Ijazah SMP/MTs atau Surat Keterangan Lulus (SKL)',
        'Fotokopi Akta Kelahiran (legalisir)',
        'Fotokopi Kartu Keluarga (legalisir)',
        'Fotokopi KTP Orang Tua/Wali (legalisir)',
        'Pas foto berwarna ukuran 3x4 sebanyak 6 lembar',
        'Surat keterangan sehat dari dokter',
        'Surat keterangan kelakuan baik dari sekolah asal',
        'Sertifikat prestasi (jika ada)'
      ],
      alurPendaftaran: [
        'Buka website PPDB online: ppdb.smkn1kotapendidikan.sch.id',
        'Klik tombol "Daftar Sekarang" pada halaman utama',
        'Isi formulir pendaftaran online dengan data yang lengkap dan benar',
        'Upload dokumen persyaratan dalam format PDF/JPG (maksimal 2MB per file)',
        'Pilih program keahlian sesuai minat (maksimal 2 pilihan)',
        'Submit formulir dan cetak bukti pendaftaran',
        'Serahkan berkas fisik ke sekolah untuk verifikasi',
        'Tunggu pengumuman hasil seleksi melalui website',
        'Jika diterima, lakukan daftar ulang sesuai jadwal yang ditentukan'
      ],
      informasiTambahan: 'Pendaftaran GRATIS! Hati-hati dengan oknum yang memungut biaya pendaftaran. Untuk informasi lebih lanjut, hubungi panitia PPDB melalui kontak yang tersedia.'
    }

    const existingPPDBSettings = await prisma.pPDBSettings.findFirst()
    
    if (!existingPPDBSettings) {
      await prisma.pPDBSettings.create({
        data: ppdbSettingsData
      })
      console.log('✅ PPDB Settings created')
    } else {
      await prisma.pPDBSettings.update({
        where: { id: existingPPDBSettings.id },
        data: ppdbSettingsData
      })
      console.log('✅ PPDB Settings updated')
    }

    // Seed Admin (jika belum ada)
    const adminExists = await prisma.admin.findFirst({
      where: { username: 'admin' }
    })

    if (!adminExists) {
      // Hash password "admin123" - dalam production gunakan bcrypt
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      await prisma.admin.create({
        data: {
          username: 'admin',
          passwordHash: hashedPassword,
          role: 'admin'
        }
      })
      console.log('✅ Admin user created (username: admin, password: admin123)')
    } else {
      console.log('ℹ️  Admin user already exists')
    }

    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })