'use client'

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import GoogleMapsSection from "./GoogleMapsSection"

interface PageData {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    content: string
  }
  contact: {
    address: string
    phone: string
    email: string
  }
  visiMisi: {
    visi: string
    misi: string
  }
  announcement: string
  ppdbSettings: {
    tahunAjaran: string
    statusPendaftaran: string
    tanggalBuka: Date
    tanggalTutup: Date
    kuotaSiswa: number
    persyaratan: string[]
    alurPendaftaran: string[]
    informasiTambahan?: string | null
  } | null
}

export default function HomeClient({ data }: { data: PageData }) {
  const [showInfo, setShowInfo] = useState(false)
  const [activeTab, setActiveTab] = useState('persyaratan')
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  // Cek apakah pendaftaran sedang buka
  const isPendaftaranOpen = data.ppdbSettings ? 
    data.ppdbSettings.statusPendaftaran === 'buka' &&
    new Date() >= new Date(data.ppdbSettings.tanggalBuka) &&
    new Date() <= new Date(data.ppdbSettings.tanggalTutup)
    : false

  // Animasi loading saat komponen dimuat
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setShowContent(true), 100)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 z-50 flex items-center justify-center">
          <div className="text-center text-white">
            {/* Logo animasi */}
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn shadow-2xl">
              <span className="text-4xl animate-bounce-gentle">🏫</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl font-bold mb-2 animate-slideDown">PPDB Online</h1>
            <p className="text-blue-100 mb-8 animate-slideDown" style={{ animationDelay: '0.2s' }}>Sekolah Dasar</p>
            
            {/* Loading dots */}
            <div className="flex justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            <p className="text-blue-200 text-sm animate-pulse-gentle">Memuat halaman...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/Dashboar.jpg"
          alt={data.hero.title}
          fill
          priority
          quality={100}
          className="object-cover object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-4xl text-white space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              {data.hero.title}
            </h1>
            
            <p className="text-xl md:text-2xl font-light animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              {data.hero.subtitle}
            </p>
            
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.9s' }}>
              {data.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fadeIn" style={{ animationDelay: '1.2s' }}>
              <Link
                href="/daftar"
                className={`px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  isPendaftaranOpen
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-600 cursor-not-allowed text-gray-300'
                }`}
              >
                {isPendaftaranOpen ? 'Daftar Sekarang' : 'Pendaftaran Tutup'}
              </Link>
              
              <button
                onClick={() => setShowInfo(true)}
                className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Info Lengkap PPDB
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Info PPDB */}
      {showInfo && data.ppdbSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Informasi PPDB {data.ppdbSettings.tahunAjaran}</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b mb-6">
              <button
                onClick={() => setActiveTab('persyaratan')}
                className={`px-4 py-2 font-medium ${activeTab === 'persyaratan' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                Persyaratan
              </button>
              <button
                onClick={() => setActiveTab('alur')}
                className={`px-4 py-2 font-medium ${activeTab === 'alur' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                Alur Pendaftaran
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 font-medium ${activeTab === 'info' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                Informasi
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === 'persyaratan' && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Persyaratan Pendaftaran:</h3>
                  <ul className="space-y-2">
                    {data.ppdbSettings.persyaratan.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'alur' && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Alur Pendaftaran:</h3>
                  <ol className="space-y-2">
                    {data.ppdbSettings.alurPendaftaran.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Informasi Umum:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>Tahun Ajaran:</strong> {data.ppdbSettings.tahunAjaran}</p>
                        <p><strong>Kuota Siswa:</strong> {data.ppdbSettings.kuotaSiswa} siswa</p>
                      </div>
                      <div>
                        <p><strong>Buka Pendaftaran:</strong> {new Date(data.ppdbSettings.tanggalBuka).toLocaleString('id-ID')}</p>
                        <p><strong>Tutup Pendaftaran:</strong> {new Date(data.ppdbSettings.tanggalTutup).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                  
                  {data.ppdbSettings.informasiTambahan && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Informasi Tambahan:</h3>
                      <p className="text-gray-700">{data.ppdbSettings.informasiTambahan}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 animate-fadeIn">
              {data.about.title}
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              {data.about.content}
            </p>
          </div>
        </div>
      </section>

      {/* ================= VISI & MISI SECTION ================= */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center animate-fadeIn">
              Visi & Misi Sekolah
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* VISI Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-blue-100 animate-fadeIn card-hover" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mr-4 animate-float">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">VISI</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {data.visiMisi.visi}
                </p>
              </div>

              {/* MISI Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-green-100 animate-fadeIn card-hover" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center mr-4 animate-float">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">MISI</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {data.visiMisi.misi}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <div className="animate-fadeIn" style={{ animationDelay: '1.2s' }}>
        <GoogleMapsSection />
      </div>
      </div>
    </>
  )
}