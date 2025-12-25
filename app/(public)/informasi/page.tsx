import { Suspense } from 'react'

async function getInformasiData() {
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
    console.error('Error fetching informasi data:', error)
    // Return fallback data
    return {
      ppdb: {
        tahunAjaran: '2025/2026',
        persyaratan: [
          'Fotokopi Akta Kelahiran yang telah dilegalisir',
          'Fotokopi Kartu Keluarga',
          'Fotokopi KTP orang tua/wali',
          'Pas foto berwarna ukuran 3x4 sebanyak 3 lembar',
          'Surat Keterangan Sehat dari dokter'
        ],
        alurPendaftaran: [
          'Daftar online melalui website',
          'Upload dokumen persyaratan',
          'Verifikasi berkas oleh admin',
          'Pengumuman hasil seleksi'
        ],
        informasiTambahan: 'Pendaftaran dilakukan secara online'
      }
    }
  }
}

export default async function InformasiPage() {
  const data = await getInformasiData()
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50">
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Informasi PPDB
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Panduan lengkap Penerimaan Peserta Didik Baru Tahun Ajaran 2025/2026
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Persyaratan */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Persyaratan Pendaftaran
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Dokumen yang Diperlukan:</h3>
                <ul className="space-y-3 text-gray-700">
                  {data.ppdb?.persyaratan?.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  )) || [
                    'Fotokopi Akta Kelahiran yang telah dilegalisir',
                    'Fotokopi Kartu Keluarga', 
                    'Pas foto berwarna ukuran 3x4 sebanyak 3 lembar',
                    'Surat Keterangan Sehat dari dokter'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Persyaratan Usia:</h3>
                <div className="bg-blue-50 rounded-2xl p-4">
                  <p className="text-blue-800 font-semibold mb-2">
                    Calon peserta didik berusia minimal 6 (enam) tahun pada tanggal 1 Juli 2025
                  </p>
                  <p className="text-blue-700 text-sm">
                    Berdasarkan Permendikbud Nomor 1 Tahun 2021 tentang Penerimaan Peserta Didik Baru
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alur Pendaftaran */}
          {data.ppdb?.alurPendaftaran && data.ppdb.alurPendaftaran.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-green-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Alur Pendaftaran
              </h2>
              <div className="space-y-4">
                {data.ppdb.alurPendaftaran.map((item: string, index: number) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl">
                    <div className="shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informasi Tambahan */}
          {data.ppdb?.informasiTambahan && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-yellow-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Informasi Tambahan
              </h2>
              <div className="bg-yellow-50 rounded-xl p-4">
                <p className="text-gray-800 leading-relaxed">{data.ppdb.informasiTambahan}</p>
              </div>
            </div>
          )}

          {/* Jalur Pendaftaran */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Jalur Penerimaan
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border-l-4 border-blue-500">
                <h3 className="text-md font-semibold text-blue-800 mb-2">Jalur Zonasi (70%)</h3>
                <p className="text-blue-700 text-xs mb-2">
                  Domisili dalam zona sekolah
                </p>
                <ul className="text-blue-600 text-xs space-y-1">
                  <li>� Sesuai zonasi ditetapkan</li>
                  <li>� KK minimal 1 tahun</li>
                  <li>� Prioritas jarak terdekat</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-2xl p-4 border-l-4 border-green-500">
                <h3 className="text-md font-semibold text-green-800 mb-2">Jalur Afirmasi (15%)</h3>
                <p className="text-green-700 text-xs mb-2">
                  Keluarga tidak mampu
                </p>
                <ul className="text-green-600 text-xs space-y-1">
                  <li>� Kartu Indonesia Pintar</li>
                  <li>� Surat tidak mampu</li>
                  <li>� Verifikasi sekolah</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 rounded-2xl p-4 border-l-4 border-orange-500">
                <h3 className="text-md font-semibold text-orange-800 mb-2">Jalur Perpindahan (5%)</h3>
                <p className="text-orange-700 text-xs mb-2">
                  Pindah tugas orang tua
                </p>
                <ul className="text-orange-600 text-xs space-y-1">
                  <li>� Surat penugasan</li>
                  <li>� Instansi berwenang</li>
                  <li>� Bukti pindah tugas</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-2xl p-4 border-l-4 border-purple-500">
                <h3 className="text-md font-semibold text-purple-800 mb-2">Jalur Prestasi (10%)</h3>
                <p className="text-purple-700 text-xs mb-2">
                  Prestasi akademik/non-akademik
                </p>
                <ul className="text-purple-600 text-xs space-y-1">
                  <li>� Sertifikat prestasi</li>
                  <li>� Tingkat minimal kecamatan</li>
                  <li>� 3 tahun terakhir</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Biaya */}
          <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-3xl shadow-lg p-6 md:p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Biaya Pendidikan
            </h2>
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 border border-green-200">
                <h3 className="text-2xl font-bold text-green-800 mb-4">Bebas Biaya</h3>
                <p className="text-gray-700 text-lg mb-6">
                  Pendidikan di UPT SD Negeri 061 Sumpira tidak dipungut biaya apapun
                </p>
                <div className="space-y-3 text-left max-w-lg mx-auto">
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 shrink-0"></span>
                    <span className="text-gray-700">Tidak ada biaya pendaftaran</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 shrink-0"></span>
                    <span className="text-gray-700">Tidak ada Sumbangan Pembangunan (SPP)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 shrink-0"></span>
                    <span className="text-gray-700">Buku pelajaran disediakan sekolah</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 shrink-0"></span>
                    <span className="text-gray-700">Seragam dan perlengkapan sekolah ditanggung sendiri</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Sesuai dengan Program Wajib Belajar 12 Tahun Pemerintah
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

