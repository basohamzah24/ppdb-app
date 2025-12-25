import HomeClient from '../components/HomeClient'
import { Suspense } from 'react'

async function getPublicData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/public/data`, { 
      cache: 'no-store', // Always get fresh data
      next: { revalidate: 0 } // Disable caching completely
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    
    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching public data:', error)
    // Return fallback data
    return {
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
  }
}

export default async function Home() {
  const publicData = await getPublicData()
  
  // Transform data untuk komponen client
  const pageData = {
    hero: {
      title: publicData.content.heroTitle,
      subtitle: publicData.content.heroSubtitle,
      description: publicData.content.heroDescription
    },
    about: {
      title: publicData.content.aboutTitle,
      content: publicData.content.aboutContent
    },
    contact: {
      address: publicData.content.contactAddress,
      phone: publicData.content.contactPhone,
      email: publicData.content.contactEmail
    },
    visiMisi: {
      visi: publicData.content.visiSekolah,
      misi: publicData.content.misiSekolah
    },
    ppdbSettings: publicData.ppdb
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 animate-pulse"></div>}>
      <HomeClient data={pageData} />
    </Suspense>
  )
}