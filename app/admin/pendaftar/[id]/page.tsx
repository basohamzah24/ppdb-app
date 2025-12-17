import { getPendaftarById } from '@/lib/actions/pendaftar'
import { getCurrentAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StatusUpdateForm } from '@/components/admin/StatusUpdateForm'

interface PendaftarDetailProps {
  params: {
    id: string
  }
  searchParams: {
    tab?: string
  }
}

export default async function PendaftarDetail({ params, searchParams }: PendaftarDetailProps) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect('/admin/login')
  }

  const pendaftar = await getPendaftarById(params.id)
  if (!pendaftar) {
    notFound()
  }

  const activeTab = searchParams.tab || 'data'

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Terverifikasi</span>
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">Menunggu Verifikasi</span>
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">Ditolak</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">-</span>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/pendaftar"
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Data Pendaftar
            </Link>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Cetak Formulir
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Detail Pendaftar</h1>
            <div className="flex items-center space-x-4">
              <p className="text-lg font-semibold text-blue-600">{pendaftar.nomorPendaftaran}</p>
              <p className="text-gray-600">{pendaftar.namaLengkap}</p>
              {getStatusBadge(pendaftar.statusVerifikasi)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            href={`/admin/pendaftar/${params.id}?tab=data`}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'data'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Data Pribadi
          </Link>
          <Link
            href={`/admin/pendaftar/${params.id}?tab=dokumen`}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dokumen'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dokumen
          </Link>
          <Link
            href={`/admin/pendaftar/${params.id}?tab=verifikasi`}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'verifikasi'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Verifikasi
          </Link>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'data' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Siswa */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Siswa</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                <p className="text-gray-900">{pendaftar.namaLengkap}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">NIK</label>
                <p className="text-gray-900">{pendaftar.nik}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Jenis Kelamin</label>
                  <p className="text-gray-900">{pendaftar.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Asal TK</label>
                  <p className="text-gray-900">{pendaftar.asalTK || 'Tidak diisi'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tempat Lahir</label>
                  <p className="text-gray-900">{pendaftar.tempatLahir}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal Lahir</label>
                  <p className="text-gray-900">{new Date(pendaftar.tanggalLahir).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Alamat</label>
                <p className="text-gray-900">{pendaftar.alamat}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Jalur Pendaftaran</label>
                  <p className="text-gray-900">{pendaftar.jalurPendaftaran}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status Kelulusan</label>
                  <p className="text-gray-900">{pendaftar.statusKelulusan}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nomor Pendaftaran</label>
                <p className="text-gray-900">{pendaftar.nomorPendaftaran}</p>
              </div>
            </div>
          </div>

          {/* Data Orang Tua */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Orang Tua</h3>
            {pendaftar.orangTua ? (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Data Ayah</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nama Ayah</label>
                      <p className="text-gray-900">{pendaftar.orangTua.namaAyah || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pekerjaan Ayah</label>
                      <p className="text-gray-900">{pendaftar.orangTua.pekerjaanAyah || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Data Ibu</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nama Ibu</label>
                      <p className="text-gray-900">{pendaftar.orangTua.namaIbu || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pekerjaan Ibu</label>
                      <p className="text-gray-900">{pendaftar.orangTua.pekerjaanIbu || '-'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">Kontak</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nomor HP</label>
                      <p className="text-gray-900">{pendaftar.orangTua.noHP || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{pendaftar.orangTua.email || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Data orang tua belum diisi</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'dokumen' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Dokumen Persyaratan</h3>
          
          {pendaftar.dokumen.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendaftar.dokumen.map((dok) => (
                <div key={dok.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{dok.jenisDokumen}</h4>
                      <p className="text-sm text-gray-500 mt-1 truncate">{dok.fileName}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Upload: {new Date(dok.createdAt).toLocaleDateString('id-ID')}
                      </p>
                      <div className="mt-2">
                        <a
                          href={dok.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Lihat Dokumen
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada dokumen</h3>
              <p className="mt-1 text-sm text-gray-500">Pendaftar belum mengupload dokumen persyaratan.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'verifikasi' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Verifikasi Pendaftaran</h3>
          
          <div className="space-y-6">
            {/* Current Status */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-medium text-gray-900">Status Verifikasi Saat Ini</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Terakhir diupdate: {new Date(pendaftar.updatedAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  {getStatusBadge(pendaftar.statusVerifikasi)}
                </div>
              </div>
            </div>

            {/* Update Status Form */}
            <StatusUpdateForm 
              pendaftarId={pendaftar.id}
              currentStatus={pendaftar.statusVerifikasi}
              catatan={pendaftar.catatanVerifikasi || ''}
            />

            {/* Verification Checklist */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">Checklist Verifikasi</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={!!pendaftar.nik}
                    readOnly
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label className="text-sm text-gray-700">Data NIK terisi dan valid</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={!!pendaftar.orangTua}
                    readOnly
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label className="text-sm text-gray-700">Data orang tua lengkap</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={pendaftar.dokumen.length >= 4}
                    readOnly
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label className="text-sm text-gray-700">Dokumen persyaratan lengkap (minimal 4 dokumen)</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={new Date().getFullYear() - new Date(pendaftar.tanggalLahir).getFullYear() >= 6}
                    readOnly
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label className="text-sm text-gray-700">Usia minimal 6 tahun</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}