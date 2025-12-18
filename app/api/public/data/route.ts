import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Ambil data PPDB settings, konten, dan pengumuman secara paralel
    const [ppdbSettings, contents, announcements] = await Promise.all([
      // PPDB Settings
      prisma.pPDBSettings.findFirst({
        orderBy: { updatedAt: 'desc' }
      }),
      
      // Content
      prisma.content.findMany({
        where: { isActive: true }
      }),
      
      // Announcements yang aktif
      prisma.announcement.findMany({
        where: {
          isPublished: true,
          OR: [
            { expiryDate: null },
            { expiryDate: { gte: new Date() } }
          ]
        },
        orderBy: [
          { priority: 'desc' },
          { publishDate: 'desc' }
        ],
        take: 5 // Ambil maksimal 5 pengumuman
      })
    ])

    // Konversi array content menjadi object untuk akses mudah
    const contentMap = contents.reduce((acc, content) => {
      acc[content.key] = content.content
      return acc
    }, {} as Record<string, string>)

    // Siapkan data response dengan fallback values
    const responseData = {
      ppdb: ppdbSettings ? {
        tahunAjaran: ppdbSettings.tahunAjaran,
        statusPendaftaran: ppdbSettings.statusPendaftaran,
        tanggalBuka: ppdbSettings.tanggalBuka,
        tanggalTutup: ppdbSettings.tanggalTutup,
        kuotaSiswa: ppdbSettings.kuotaSiswa,
        persyaratan: ppdbSettings.persyaratan,
        alurPendaftaran: ppdbSettings.alurPendaftaran,
        informasiTambahan: ppdbSettings.informasiTambahan
      } : null,
      
      content: {
        heroTitle: contentMap.hero_title || 'UPT SD Negeri 061 Sumpira',
        heroSubtitle: contentMap.hero_subtitle || 'PPDB Online Tahun Ajaran 2025/2026',
        heroDescription: contentMap.hero_description || 'Selamat datang di sistem Penerimaan Peserta Didik Baru (PPDB) Online UPT SD Negeri 061 Sumpira. Daftar sekarang untuk masa depan yang cerah!',
        aboutTitle: contentMap.about_title || 'Tentang Sekolah Kami',
        aboutContent: contentMap.about_content || 'UPT SD Negeri 061 Sumpira adalah sekolah dasar negeri yang berkomitmen untuk memberikan pendidikan berkualitas bagi putra-putri Indonesia.',
        visiSekolah: contentMap.visi_sekolah || 'Mewujudkan peserta didik yang beriman, bertakwa, berakhlak mulia, cerdas, kreatif, dan berprestasi dalam menghadapi tantangan masa depan.',
        misiSekolah: contentMap.misi_sekolah || 'Menyelenggarakan pendidikan yang berkualitas, mengembangkan potensi peserta didik secara optimal, menciptakan lingkungan belajar yang kondusif.',
        contactAddress: contentMap.contact_address || 'Jalan Trans Sumpira, Kec. Baebunta, Kab. Luwu Utara, Sulawesi Selatan',
        contactPhone: contentMap.contact_phone || '(0473) 123456',
        contactEmail: contentMap.contact_email || 'info@uptsdn061sumpira.sch.id'
      },
      
      announcements: announcements.map(ann => ({
        id: ann.id,
        title: ann.title,
        content: ann.content,
        type: ann.type,
        publishDate: ann.publishDate,
        priority: ann.priority
      }))
    }

    return NextResponse.json({
      success: true,
      data: responseData
    })
    
  } catch (error) {
    console.error('Error fetching public data:', error)
    
    // Return fallback data jika error
    const fallbackData = {
      ppdb: null,
      content: {
        heroTitle: 'UPT SD Negeri 061 Sumpira',
        heroSubtitle: 'PPDB Online Tahun Ajaran 2025/2026',
        heroDescription: 'Selamat datang di sistem Penerimaan Peserta Didik Baru (PPDB) Online.',
        aboutTitle: 'Tentang Sekolah Kami',
        aboutContent: 'Sekolah dasar negeri yang berkomitmen memberikan pendidikan berkualitas.',
        visiSekolah: 'Mewujudkan peserta didik yang beriman, bertakwa, dan berprestasi.',
        misiSekolah: 'Menyelenggarakan pendidikan yang berkualitas.',
        contactAddress: 'Jalan Trans Sumpira, Kec. Baebunta',
        contactPhone: '(0473) 123456',
        contactEmail: 'info@uptsdn061sumpira.sch.id'
      },
      announcements: []
    }
    
    return NextResponse.json({
      success: true,
      data: fallbackData
    })
  } finally {
    await prisma.$disconnect()
  }
}