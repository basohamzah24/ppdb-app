import { Suspense } from 'react'
import DynamicSchedule from '@/app/components/DynamicSchedule'

async function getJadwalData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/public/data`, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    
    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching jadwal data:', error)
    // Return fallback data
    return {
      ppdb: {
        tahunAjaran: '2025/2026',
        statusPendaftaran: 'tutup',
        tanggalBuka: new Date('2025-05-16'),
        tanggalTutup: new Date('2025-06-15'),
        kuotaSiswa: 100
      }
    }
  }
}

export default async function JadwalPage() {
  const data = await getJadwalData()
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jadwal PPDB
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Jadwal Penerimaan Peserta Didik Baru Tahun Ajaran {data.ppdb?.tahunAjaran || '2025/2026'}
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Jadwal Dinamis dari Admin */}
          <Suspense fallback={
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-blue-100">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          }>
            <DynamicSchedule />
          </Suspense>

          {/* Jadwal Khusus per Jalur */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Jadwal Verifikasi Dokumen</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-800">Jalur Zonasi</span>
                  <span className="text-sm text-blue-600">1-2 Juni 2025</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-green-800">Jalur Afirmasi</span>
                  <span className="text-sm text-green-600">3 Juni 2025</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-orange-800">Jalur Perpindahan</span>
                  <span className="text-sm text-orange-600">4 Juni 2025</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium text-purple-800">Jalur Prestasi</span>
                  <span className="text-sm text-purple-600">5 Juni 2025</span>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Waktu Operasional</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Pendaftaran Online</h4>
                  <p className="text-sm text-gray-600">24 jam setiap hari</p>
                  <p className="text-xs text-gray-500">Melalui website resmi sekolah</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Verifikasi Dokumen</h4>
                  <p className="text-sm text-gray-600">08:00 - 14:00 WIB</p>
                  <p className="text-xs text-gray-500">Senin - Jumat di sekolah</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Informasi & Konsultasi</h4>
                  <p className="text-sm text-gray-600">08:00 - 15:00 WIB</p>
                  <p className="text-xs text-gray-500">Ruang Tata Usaha</p>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Penting */}
          <div className="bg-linear-to-r from-red-50 to-orange-50 rounded-3xl shadow-lg p-6 md:p-8 border border-red-200">
            <h3 className="text-xl font-bold text-red-800 mb-4">Informasi Penting</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-700 mb-3">Ketentuan Umum:</h4>
                <ul className="space-y-2 text-red-600 text-sm">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Pendaftaran hanya dapat dilakukan sekali per calon siswa</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Dokumen yang diserahkan harus asli dan fotokopi</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Tidak ada biaya pendaftaran apapun</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 mb-3">Sanksi:</h4>
                <ul className="space-y-2 text-red-600 text-sm">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Dokumen palsu akan diskualifikasi</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Tidak hadir daftar ulang dianggap mengundurkan diri</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Keputusan panitia tidak dapat diganggu gugat</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

