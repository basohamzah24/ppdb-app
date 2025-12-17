import { getContentByKey, getPPDBSettings } from './admin/actions/content'
import HomeClient from './components/HomeClient'
import { Suspense } from 'react'

export default async function Home() {
  // Ambil data konten dari database
  const heroTitle = await getContentByKey('hero-title')
  const heroSubtitle = await getContentByKey('hero-subtitle') 
  const heroDescription = await getContentByKey('hero-description')
  const aboutTitle = await getContentByKey('about-title')
  const aboutContent = await getContentByKey('about-content')
  const contactAddress = await getContentByKey('contact-address')
  const contactPhone = await getContentByKey('contact-phone')
  const contactEmail = await getContentByKey('contact-email')
  const announcement = await getContentByKey('announcement-main')
  
  // Ambil pengaturan PPDB
  const ppdbSettings = await getPPDBSettings()

  // Data untuk komponen client
  const pageData = {
    hero: {
      title: heroTitle?.content || 'UPT SD Negeri 061 Sumpira',
      subtitle: heroSubtitle?.content || 'PPDB Online Tahun Ajaran 2024/2025',
      description: heroDescription?.content || 'Selamat datang di sistem Penerimaan Peserta Didik Baru (PPDB) Online UPT SD Negeri 061 Sumpira. Daftar sekarang untuk masa depan yang cerah!'
    },
    about: {
      title: aboutTitle?.content || 'Tentang Sekolah Kami',
      content: aboutContent?.content || 'UPT SD Negeri 061 Sumpira adalah sekolah dasar negeri yang berkomitmen untuk memberikan pendidikan berkualitas bagi putra-putri Indonesia. Dengan fasilitas lengkap dan tenaga pengajar yang berpengalaman, kami siap membentuk generasi penerus bangsa yang cerdas dan berkarakter.'
    },
    contact: {
      address: contactAddress?.content || 'Jl. Pendidikan No. 061, Sumpira',
      phone: contactPhone?.content || '(021) 1234567',
      email: contactEmail?.content || 'info@sd061sumpira.sch.id'
    },
    announcement: announcement?.content || '',
    ppdbSettings: ppdbSettings ? {
      tahunAjaran: ppdbSettings.tahunAjaran,
      statusPendaftaran: ppdbSettings.statusPendaftaran,
      tanggalBuka: ppdbSettings.tanggalBuka,
      tanggalTutup: ppdbSettings.tanggalTutup,
      kuotaSiswa: ppdbSettings.kuotaSiswa,
      persyaratan: ppdbSettings.persyaratan as string[],
      alurPendaftaran: ppdbSettings.alurPendaftaran as string[],
      informasiTambahan: ppdbSettings.informasiTambahan
    } : null
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 animate-pulse"></div>}>
      <HomeClient data={pageData} />
    </Suspense>
  )
}
              <Link
                href="/pendaftaran"
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:scale-105 transition text-white font-semibold px-8 py-4 rounded-full shadow-lg"
              >
                Mulai Pendaftaran
              </Link>

              <a
                href="#info-sekolah"
                className="border border-white/40 px-8 py-4 rounded-full hover:bg-white/10 transition"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main
        id="info-sekolah"
        className="bg-gradient-to-br from-sky-50 via-emerald-50 to-blue-50 py-16"
      >
        <div className="container mx-auto px-4">
          {/* Welcome */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">
              Selamat Datang di PPDB Online
            </h3>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Proses pendaftaran mudah, aman, dan ramah untuk si kecil.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Daftar */}
            <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col">
              <h4 className="text-xl font-bold mb-4">Daftar Online</h4>
              <p className="text-gray-600 mb-6 flex-1">
                Lakukan pendaftaran secara online dengan sistem terintegrasi.
              </p>
              <Link
                href="/pendaftaran"
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-full text-center font-semibold"
              >
                Daftar Sekarang
              </Link>
            </div>

            {/* Info */}
            <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col">
              <h4 className="text-xl font-bold mb-4">Informasi PPDB</h4>
              <p className="text-gray-600 mb-6 flex-1">
                Lihat jalur pendaftaran, syarat, dan ketentuan.
              </p>
              <button
                onClick={() => setShowInfo(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold"
              >
                Lihat Detail
              </button>
            </div>

            {/* Jadwal */}
            <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col">
              <h4 className="text-xl font-bold mb-4">Jadwal</h4>
              <ul className="text-gray-600 mb-6 flex-1 space-y-2">
                <li>• 1-15 Juli 2025: Pendaftaran</li>
                <li>• 16-20 Juli 2025: Seleksi</li>
                <li>• 25 Juli 2025: Pengumuman</li>
              </ul>
              <Link
                href="/jadwal"
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-full font-semibold text-center"
              >
                Lihat Jadwal
              </Link>
            </div>
          </div>

          {/* Google Maps */}
          <div className="mt-20">
            <GoogleMapsSection />
          </div>
        </div>
      </main>

      {/* ================= MODAL ================= */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Informasi PPDB</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Usia minimal 6 tahun</li>
              <li>• Akta kelahiran</li>
              <li>• Kartu keluarga</li>
              <li>• Pas foto</li>
            </ul>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowInfo(false)}
                className="px-6 py-2 bg-gray-300 rounded-full"
              >
                Tutup
              </button>
              <Link
                href="/pendaftaran"
                className="px-6 py-2 bg-blue-500 text-white rounded-full"
                onClick={() => setShowInfo(false)}
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <h4 className="font-semibold">UPT SD Negeri 061 Sumpira</h4>
          <p className="text-sm text-gray-600 mt-2">
            Jalan Trans Sumpira, Kec. Baebunta, Kab. Luwu Utara
          </p>
          <p className="text-sm text-gray-600">
            Email: info@uptsdn061sumpira.sch.id
          </p>
          <p className="text-xs text-gray-500 mt-4">
            © 2025 UPT SD Negeri 061 Sumpira
          </p>
        </div>
      </footer>
    </div>
  )
}