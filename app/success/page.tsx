import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-green-100">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pendaftaran Berhasil! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Terima kasih! Data pendaftaran Anda telah berhasil tersimpan dalam sistem PPDB kami.
          </p>

          {/* Information Card */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">Langkah Selanjutnya:</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">1</span>
                <p className="text-left">Periksa email Anda untuk konfirmasi pendaftaran</p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">2</span>
                <p className="text-left">Siapkan dokumen-dokumen yang diperlukan untuk verifikasi</p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">3</span>
                <p className="text-left">Pantau pengumuman hasil seleksi di website ini</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Informasi Kontak:</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>📍 UPT SD Negeri 061 Sumpira</p>
              <p>📞 Telp: (022) 1234567</p>
              <p>✉️ Email: info@sdnegeri061.sch.id</p>
              <p>🕒 Jam Layanan: 08:00 - 15:00 WIB</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/status"
              className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
            >
              Cek Status Pendaftaran
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-xs text-gray-500">
            <p>Nomor pendaftaran dan detail lainnya akan dikirimkan melalui email.</p>
            <p>Simpan nomor pendaftaran Anda untuk keperluan verifikasi selanjutnya.</p>
          </div>
        </div>
      </div>
    </div>
  )
}