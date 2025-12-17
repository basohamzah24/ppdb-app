import { getPendaftarList } from '@/lib/actions/pendaftar'
import { getCurrentAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'



interface DataPendaftarProps {
  searchParams: {
    search?: string
    status?: string
    gender?: string
    page?: string
  }
}

export default async function DataPendaftar({ searchParams }: DataPendaftarProps) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect('/admin/login')
  }

  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''
  const status = searchParams.status || 'all'
  const gender = searchParams.gender || 'all'
  const limit = 10

  const result = await getPendaftarList(search, status === 'all' ? undefined : status, gender === 'all' ? undefined : gender, page, limit)



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Terverifikasi</span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Menunggu</span>
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Ditolak</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">-</span>
    }
  }



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Pendaftar PPDB</h1>
            <p className="text-gray-600">Total {result.total} pendaftar</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Export Excel
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Pencarian</h2>
        <form method="GET" action="/admin/pendaftar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Siswa</label>
              <input
                type="text"
                name="search"
                placeholder="Nama, No. Pendaftaran, atau NIK..."
                defaultValue={search}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Verifikasi</label>
              <select
                name="status"
                defaultValue={status}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="verified">Terverifikasi</option>
                <option value="pending">Menunggu</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
              <select
                name="gender"
                defaultValue={gender}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Filter
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Pendaftaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Lengkap
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  L/P
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orang Tua
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokumen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.pendaftar.map((student) => {
                const dokumenCount = student.dokumen.length
                const isDokumenLengkap = dokumenCount >= 4 // Asumsi minimal 4 dokumen
                
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{student.nomorPendaftaran}</div>
                      <div className="text-xs text-gray-500">{new Date(student.createdAt).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.namaLengkap}</div>
                      <div className="text-xs text-gray-500">{student.tempatLahir}, {new Date(student.tanggalLahir).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.nik}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.orangTua?.namaAyah || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{student.orangTua?.noHP || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(student.statusVerifikasi)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isDokumenLengkap ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isDokumenLengkap ? 'Lengkap' : `${dokumenCount}/4 dokumen`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/pendaftar/${student.id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Detail
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                          href={`/admin/pendaftar/${student.id}?tab=verifikasi`}
                          className="text-green-600 hover:text-green-700"
                        >
                          Verifikasi
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {result.pages > 1 && (
          <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{((page - 1) * limit) + 1}</span> sampai{' '}
                  <span className="font-medium">{Math.min(page * limit, result.total)}</span> dari{' '}
                  <span className="font-medium">{result.total}</span> hasil
                </p>
              </div>
              <div className="flex space-x-2">
                {page > 1 && (
                  <Link
                    href={`?page=${page - 1}&search=${search}&status=${status}&gender=${gender}`}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Sebelumnya
                  </Link>
                )}
                {page < result.pages && (
                  <Link
                    href={`?page=${page + 1}&search=${search}&status=${status}&gender=${gender}`}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Selanjutnya
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

