import { getPengumumanList } from '@/lib/actions/pengumuman'
import { getCurrentAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface PengumumanPageProps {
  searchParams: {
    status?: string
    tipe?: string
    search?: string
  }
}

export default async function Pengumuman({ searchParams }: PengumumanPageProps) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect('/admin/login')
  }

  const status = searchParams.status || 'all'
  const tipe = searchParams.tipe || 'all'
  const search = searchParams.search || ''

  const pengumumanList = await getPengumumanList(
    search,
    status === 'all' ? undefined : status,
    tipe === 'all' ? undefined : tipe
  )



  const getTipeBadge = (tipe: string) => {
    switch (tipe) {
      case 'info':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Info</span>
      case 'warning':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Peringatan</span>
      case 'success':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Sukses</span>
      case 'urgent':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Penting</span>
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Dipublikasi</span>
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Draft</span>
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Pengumuman</h1>
            <p className="text-gray-600">Kelola pengumuman untuk siswa dan orang tua</p>
          </div>
          <Link
            href="/admin/pengumuman/buat"
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Buat Pengumuman
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form method="GET" action="/admin/pengumuman">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Pengumuman</label>
              <input
                type="text"
                name="search"
                placeholder="Judul atau konten..."
                defaultValue={search}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                defaultValue={status}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="published">Dipublikasi</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
              <select
                name="tipe"
                defaultValue={tipe}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Tipe</option>
                <option value="info">Info</option>
                <option value="warning">Peringatan</option>
                <option value="success">Sukses</option>
                <option value="urgent">Penting</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Filter
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {pengumumanList.map((pengumuman) => (
          <div key={pengumuman.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-3">
                  {pengumuman.isPinned && (
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
                    </svg>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{pengumuman.judul}</h3>
                  {getTipeBadge(pengumuman.tipe)}
                  {getStatusBadge(pengumuman.status)}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{pengumuman.isi}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>Dibuat: {new Date(pengumuman.createdAt).toLocaleDateString('id-ID')}</span>
                  {pengumuman.tanggalPublish && (
                    <span>Dipublikasi: {new Date(pengumuman.tanggalPublish).toLocaleDateString('id-ID')}</span>
                  )}
                  <span>oleh Admin</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href={`/admin/pengumuman/edit/${pengumuman.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {pengumumanList.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada pengumuman</h3>
            <p className="mt-1 text-sm text-gray-500">Belum ada pengumuman yang dibuat sesuai filter.</p>
          </div>
        )}
      </div>

    </div>
  )
}

