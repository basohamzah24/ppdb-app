import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.pendaftar.deleteMany({})
  await prisma.siteContent.deleteMany({})
  await prisma.pPDBSettings.deleteMany({})

  // 1. Create Admin User
  console.log('📝 Creating admin user...')
  const adminPasswordHash = await bcrypt.hash('admin123', 12)
  
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash: adminPasswordHash
    },
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'admin'
    }
  })

  // 2. Create Site Content
  console.log('📄 Creating site content...')
  const contentData = [
    {
      key: 'hero_title',
      title: 'Hero Title',
      content: 'UPT SD Negeri 061 Sumpira',
      type: 'hero'
    },
    {
      key: 'hero_subtitle', 
      title: 'Hero Subtitle',
      content: 'PPDB Online Tahun Ajaran 2025/2026',
      type: 'hero'
    },
    {
      key: 'hero_description',
      title: 'Hero Description',
      content: 'Selamat datang di sistem Penerimaan Peserta Didik Baru (PPDB) Online UPT SD Negeri 061 Sumpira. Daftar sekarang untuk masa depan yang cerah!',
      type: 'hero'
    },
    {
      key: 'about_title',
      title: 'About Title',
      content: 'Tentang Sekolah Kami',
      type: 'info'
    },
    {
      key: 'about_content',
      title: 'About Content',
      content: 'UPT SD Negeri 061 Sumpira adalah sekolah dasar negeri yang berkomitmen untuk memberikan pendidikan berkualitas bagi putra-putri Indonesia. Dengan fasilitas lengkap dan tenaga pengajar yang berpengalaman, kami siap membentuk generasi penerus bangsa yang cerdas dan berkarakter.',
      type: 'info'
    },
    {
      key: 'contact_address',
      title: 'Contact Address',
      content: 'Jalan Trans Sumpira, Kec. Baebunta, Kab. Luwu Utara, Sulawesi Selatan',
      type: 'contact'
    },
    {
      key: 'contact_phone',
      title: 'Contact Phone', 
      content: '(0473) 123456',
      type: 'contact'
    },
    {
      key: 'contact_email',
      title: 'Contact Email',
      content: 'info@uptsdn061sumpira.sch.id',
      type: 'contact'
    },
    {
      key: 'announcement_main',
      title: 'Main Announcement',
      content: 'Pendaftaran PPDB Online UPT SD Negeri 061 Sumpira untuk Tahun Ajaran 2025/2026 telah dibuka! Daftar sekarang sebelum kuota penuh.',
      type: 'announcement'
    }
  ]

  for (const content of contentData) {
    await prisma.siteContent.create({
      data: content
    })
  }

  // 3. Create PPDB Settings
  console.log('⚙️ Creating PPDB settings...')
  await prisma.pPDBSettings.create({
    data: {
      tahunAjaran: '2025/2026',
      tanggalBuka: new Date('2025-07-01'),
      tanggalTutup: new Date('2025-07-15'),
      kuotaSiswa: 120,
      statusPendaftaran: 'buka',
      persyaratan: [
        'Usia minimal 6 tahun pada tanggal 1 Juli 2025',
        'Memiliki akta kelahiran',
        'Kartu Keluarga (KK)',
        'Fotokopi KTP orangtua',
        'Pas foto ukuran 3x4 (2 lembar)',
        'Surat keterangan sehat dari dokter'
      ],
      alurPendaftaran: [
        'Daftar online melalui website PPDB',
        'Mengisi formulir pendaftaran dengan lengkap',
        'Upload dokumen persyaratan',
        'Verifikasi berkas oleh panitia',
        'Pengumuman hasil seleksi',
        'Daftar ulang bagi yang diterima'
      ],
      informasiTambahan: 'Untuk informasi lebih lanjut, silakan hubungi kantor sekolah pada jam kerja 07.00 - 15.00 WIB.'
    }
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })