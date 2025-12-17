import { getContentByKey, getPPDBSettings } from '@/lib/content'
import HomeClient from './components/HomeClient'
import { Suspense } from 'react'

export default async function Home() {
  // Ambil data konten dari database menggunakan service yang bersih
  const heroTitle = await getContentByKey('hero_title')
  const heroSubtitle = await getContentByKey('hero_subtitle')
  const heroDescription = await getContentByKey('hero_description')
  const aboutTitle = await getContentByKey('about_title')
  const aboutContent = await getContentByKey('about_content')
  const contactAddress = await getContentByKey('contact_address')
  const contactPhone = await getContentByKey('contact_phone')
  const contactEmail = await getContentByKey('contact_email')
  const announcement = await getContentByKey('announcement_main')
  
  // Ambil pengaturan PPDB
  const ppdbSettings = await getPPDBSettings()

  // Data untuk komponen client
  const pageData = {
    hero: {
      title: heroTitle?.content || 'UPT SD Negeri 061 Sumpira',
      subtitle: heroSubtitle?.content || 'PPDB Online Tahun Ajaran 2025/2026',
      description: heroDescription?.content || 'Selamat datang di sistem Penerimaan Peserta Didik Baru (PPDB) Online UPT SD Negeri 061 Sumpira. Daftar sekarang untuk masa depan yang cerah!'
    },
    about: {
      title: aboutTitle?.content || 'Tentang Sekolah Kami',
      content: aboutContent?.content || 'UPT SD Negeri 061 Sumpira adalah sekolah dasar negeri yang berkomitmen untuk memberikan pendidikan berkualitas bagi putra-putri Indonesia. Dengan fasilitas lengkap dan tenaga pengajar yang berpengalaman, kami siap membentuk generasi penerus bangsa yang cerdas dan berkarakter.'
    },
    contact: {
      address: contactAddress?.content || 'Jalan Trans Sumpira, Kec. Baebunta, Kab. Luwu Utara, Sulawesi Selatan',
      phone: contactPhone?.content || '(0473) 123456',
      email: contactEmail?.content || 'info@uptsdn061sumpira.sch.id'
    },
    announcement: announcement?.content || '',
    ppdbSettings: ppdbSettings ? {
      tahunAjaran: ppdbSettings.tahunAjaran,
      statusPendaftaran: ppdbSettings.statusPendaftaran,
      tanggalBuka: ppdbSettings.tanggalBuka,
      tanggalTutup: ppdbSettings.tanggalTutup,
      kuotaSiswa: ppdbSettings.kuotaSiswa,
      persyaratan: Array.isArray(ppdbSettings.persyaratan) ? ppdbSettings.persyaratan as string[] : [],
      alurPendaftaran: Array.isArray(ppdbSettings.alurPendaftaran) ? ppdbSettings.alurPendaftaran as string[] : [],
      informasiTambahan: ppdbSettings.informasiTambahan
    } : null
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 animate-pulse"></div>}>
      <HomeClient data={pageData} />
    </Suspense>
  )
}