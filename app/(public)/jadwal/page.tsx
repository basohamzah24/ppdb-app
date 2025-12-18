

export default function JadwalPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jadwal PPDB
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Jadwal Penerimaan Peserta Didik Baru Tahun Ajaran 2025/2026
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Timeline Utama */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Tahapan Pendaftaran
            </h2>
            
            <div className="space-y-6">
              {/* Sosialisasi */}
              <div className="flex items-start space-x-4 pb-6 border-b border-gray-200">
                <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Sosialisasi PPDB</h3>
                      <p className="text-gray-600 text-sm mb-2">Penyebarluasan informasi kepada masyarakat</p>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg">
                      <span className="text-blue-800 font-medium text-sm">1 - 15 Mei 2025</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Informasi melalui website sekolah, spanduk, dan pengumuman di media sosial
                  </div>
                </div>
              </div>

              {/* Pendaftaran */}
              <div className="flex items-start space-x-4 pb-6 border-b border-gray-200">
                <div className="shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Pendaftaran Online</h3>
                      <p className="text-gray-600 text-sm mb-2">Pengisian formulir dan upload dokumen</p>
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-lg">
                      <span className="text-green-800 font-medium text-sm">16 - 31 Mei 2025</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Pendaftaran melalui website resmi dan verifikasi dokumen offline
                  </div>
                </div>
              </div>

              {/* Seleksi */}
              <div className="flex items-start space-x-4 pb-6 border-b border-gray-200">
                <div className="shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Seleksi dan Verifikasi</h3>
                      <p className="text-gray-600 text-sm mb-2">Proses seleksi berdasarkan jalur pendaftaran</p>
                    </div>
                    <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                      <span className="text-yellow-800 font-medium text-sm">1 - 5 Juni 2025</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Verifikasi dokumen dan proses seleksi sesuai jalur masing-masing
                  </div>
                </div>
              </div>

              {/* Pengumuman */}
              <div className="flex items-start space-x-4 pb-6 border-b border-gray-200">
                <div className="shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Pengumuman Hasil</h3>
                      <p className="text-gray-600 text-sm mb-2">Pengumuman calon siswa yang diterima</p>
                    </div>
                    <div className="bg-purple-50 px-4 py-2 rounded-lg">
                      <span className="text-purple-800 font-medium text-sm">10 Juni 2025</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Pengumuman melalui website sekolah dan papan pengumuman
                  </div>
                </div>
              </div>

              {/* Daftar Ulang */}
              <div className="flex items-start space-x-4">
                <div className="shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Daftar Ulang</h3>
                      <p className="text-gray-600 text-sm mb-2">Konfirmasi kehadiran dan melengkapi berkas</p>
                    </div>
                    <div className="bg-red-50 px-4 py-2 rounded-lg">
                      <span className="text-red-800 font-medium text-sm">11 - 15 Juni 2025</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Wajib hadir ke sekolah dengan membawa dokumen asli untuk verifikasi
                  </div>
                </div>
              </div>
            </div>
          </div>

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

