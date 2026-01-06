'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  Users, 
  Search, 
  Filter, 
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

interface PendaftarData {
  id: string
  noPendaftaran: string
  nama: string
  nik: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: string
  agama: string
  alamat: string
  jalurPendaftaran: string
  asalSekolah?: string
  statusPendaftaran: string
  tanggalDaftar: string
  
  // Dokumen fields  
  aktaKelahiran_nama?: string
  aktaKelahiran_path?: string
  aktaKelahiran_ukuran?: number
  aktaKelahiran_status?: string
  
  kartuKeluarga_nama?: string
  kartuKeluarga_path?: string
  kartuKeluarga_ukuran?: number
  kartuKeluarga_status?: string
  
  fotoSiswa_nama?: string
  fotoSiswa_path?: string
  fotoSiswa_ukuran?: number
  fotoSiswa_status?: string
  
  orangTua: {
    namaAyah: string
    namaIbu: string
    noTelp: string
    email?: string
  }[]
  dokumen: {
    id: string
    jenisDokumen: string
    namaFile: string
    status: string
  }[]
  _count: {
    dokumen: number
  }
}

interface PaginationInfo {
  current: number
  total: number
  totalRecords: number
  hasNext: boolean
  hasPrev: boolean
}

export default function AdminPendaftar() {
  const [pendaftar, setPendaftar] = useState<PendaftarData[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    current: 1,
    total: 1,
    totalRecords: 0,
    hasNext: false,
    hasPrev: false
  })
  
  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [jalurFilter, setJalurFilter] = useState('')
  const [selectedPendaftar, setSelectedPendaftar] = useState<PendaftarData | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadPendaftar()
  }, [pagination.current, statusFilter, jalurFilter])

  const loadPendaftar = async (page = pagination.current) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })

      if (search) params.append('search', search)
      if (statusFilter) params.append('status', statusFilter)
      if (jalurFilter) params.append('jalur', jalurFilter)

      const response = await fetch(`/api/admin/pendaftar?${params}`)
      const result = await response.json()

      if (result.success) {
        setPendaftar(result.data)
        setPagination(result.pagination)
      } else {
        console.error('Error loading pendaftar:', result.error)
      }
    } catch (error) {
      console.error('Error loading pendaftar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }))
    loadPendaftar(1)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/pendaftar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })

      const result = await response.json()
      if (result.success) {
        loadPendaftar()
        alert('Status berhasil diupdate!')
      } else {
        alert('Gagal update status: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Terjadi kesalahan saat update status')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-700', icon: Clock, label: 'Draft' },
      submit: { color: 'bg-blue-100 text-blue-700', icon: Clock, label: 'Submit' },
      review: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Review' },
      accepted: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Diterima' },
      rejected: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Ditolak' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const getDokumenStatus = (count: number) => {
    if (count >= 3) return { color: 'text-green-600', label: 'Lengkap', icon: CheckCircle }
    if (count > 0) return { color: 'text-yellow-600', label: 'Belum Lengkap', icon: Clock }
    return { color: 'text-red-600', label: 'Belum Upload', icon: XCircle }
  }

  return (
    <AdminLayout 
      title="Data Pendaftar PPDB" 
      subtitle="Kelola dan verifikasi data pendaftar peserta didik baru"
    >
      <div className="space-y-6">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Manajemen Pendaftar</h2>
                <p className="text-sm text-gray-600">Total: {pagination.total} siswa terdaftar</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => loadPendaftar()}
                disabled={loading}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 flex items-center disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link 
                href="/admin/laporan" 
                className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-200 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Filter & Pencarian</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Cari Pendaftar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Nama, No Pendaftaran, atau NIK"
                  className="pl-10 w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status Pendaftaran</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              >
                <option value="">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="submit">Submit</option>
                <option value="review">Review</option>
                <option value="accepted">Diterima</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Jalur Pendaftaran</label>
              <select
                value={jalurFilter}
                onChange={(e) => setJalurFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              >
              <option value="">Semua Jalur</option>
              <option value="reguler">Reguler</option>
              <option value="prestasi">Prestasi</option>
              <option value="Zonasi">Zonasi</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Cari
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pendaftar</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.totalRecords}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Diterima</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendaftar.filter(p => p.statusPendaftaran === 'accepted').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendaftar.filter(p => p.statusPendaftaran === 'review').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dokumen Lengkap</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendaftar.filter(p => p._count.dokumen >= 3).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendaftar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Pribadi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jalur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokumen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                    </td>
                  </tr>
                ))
              ) : pendaftar.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>Tidak ada data pendaftar ditemukan</p>
                  </td>
                </tr>
              ) : (
                pendaftar.map((item) => {
                  const dokumenStatus = getDokumenStatus(item._count.dokumen)
                  const DokumenIcon = dokumenStatus.icon
                  const ortu = item.orangTua[0]
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.nama}</div>
                          <div className="text-sm text-gray-500">{item.noPendaftaran}</div>
                          <div className="text-xs text-gray-400">NIK: {item.nik}</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{item.tempatLahir}, {new Date(item.tanggalLahir).toLocaleDateString('id-ID')}</div>
                          <div className="text-gray-500">{item.jenisKelamin} • {item.agama}</div>
                          {ortu && (
                            <div className="text-xs text-gray-400 mt-1">
                              {ortu.namaAyah} / {ortu.namaIbu}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {item.jalurPendaftaran}
                        </span>
                        {item.asalSekolah && (
                          <div className="text-xs text-gray-500 mt-1">{item.asalSekolah}</div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <DokumenIcon className={`h-4 w-4 mr-1 ${dokumenStatus.color}`} />
                          <span className={`text-sm ${dokumenStatus.color}`}>
                            {item._count.dokumen}/3
                          </span>
                        </div>
                        <div className={`text-xs ${dokumenStatus.color}`}>
                          {dokumenStatus.label}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {getStatusBadge(item.statusPendaftaran)}
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(item.tanggalDaftar).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedPendaftar(item)
                              setShowModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <select
                            value={item.statusPendaftaran}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="submit">Submit</option>
                            <option value="review">Review</option>
                            <option value="accepted">Diterima</option>
                            <option value="rejected">Ditolak</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalRecords > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => loadPendaftar(pagination.current - 1)}
                disabled={!pagination.hasPrev}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => loadPendaftar(pagination.current + 1)}
                disabled={!pagination.hasNext}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{((pagination.current - 1) * 10) + 1}</span>
                  {' '} to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.current * 10, pagination.totalRecords)}
                  </span>
                  {' '} of{' '}
                  <span className="font-medium">{pagination.totalRecords}</span>
                  {' '} results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => loadPendaftar(pagination.current - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.total) }).map((_, i) => {
                    const pageNum = i + Math.max(1, pagination.current - 2)
                    if (pageNum > pagination.total) return null
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => loadPendaftar(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === pagination.current
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => loadPendaftar(pagination.current + 1)}
                    disabled={!pagination.hasNext}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedPendaftar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detail Pendaftar</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Pribadi */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Data Pribadi</h3>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">No Pendaftaran</label>
                    <p className="text-gray-900 font-mono">{selectedPendaftar.noPendaftaran}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nama Lengkap</label>
                    <p className="text-gray-900">{selectedPendaftar.nama}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">NIK</label>
                    <p className="text-gray-900 font-mono">{selectedPendaftar.nik}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tempat, Tanggal Lahir</label>
                    <p className="text-gray-900">
                      {selectedPendaftar.tempatLahir}, {new Date(selectedPendaftar.tanggalLahir).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Jenis Kelamin</label>
                    <p className="text-gray-900">{selectedPendaftar.jenisKelamin}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Agama</label>
                    <p className="text-gray-900">{selectedPendaftar.agama}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Alamat
                    </label>
                    <p className="text-gray-900">{selectedPendaftar.alamat}</p>
                  </div>
                </div>

                {/* Data Orang Tua */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Data Orang Tua</h3>
                  
                  {selectedPendaftar.orangTua[0] && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Nama Ayah</label>
                        <p className="text-gray-900">{selectedPendaftar.orangTua[0].namaAyah}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600">Nama Ibu</label>
                        <p className="text-gray-900">{selectedPendaftar.orangTua[0].namaIbu}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          No Telepon
                        </label>
                        <p className="text-gray-900 font-mono">{selectedPendaftar.orangTua[0].noTelp}</p>
                      </div>
                      
                      {selectedPendaftar.orangTua[0].email && (
                        <div>
                          <label className="text-sm font-medium text-gray-600 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </label>
                          <p className="text-gray-900">{selectedPendaftar.orangTua[0].email}</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Jalur Pendaftaran</label>
                    <p className="text-gray-900">{selectedPendaftar.jalurPendaftaran}</p>
                  </div>
                  
                  {selectedPendaftar.asalSekolah && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Asal Sekolah</label>
                      <p className="text-gray-900">{selectedPendaftar.asalSekolah}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status Pendaftaran</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedPendaftar.statusPendaftaran)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tanggal Daftar</label>
                    <p className="text-gray-900">
                      {new Date(selectedPendaftar.tanggalDaftar).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dokumen */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Dokumen ({selectedPendaftar._count.dokumen}/3)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPendaftar.dokumen.map((dok) => (
                    <div key={dok.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{dok.jenisDokumen.replace('_', ' ')}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          dok.status === 'approved' ? 'bg-green-100 text-green-700' :
                          dok.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {dok.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p className="font-medium">Dokumen wajib:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Akta Kelahiran</li>
                    <li>Kartu Keluarga</li>
                    <li>Foto 3x4 Latar Merah</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Tutup
                </button>
                <select
                  value={selectedPendaftar.statusPendaftaran}
                  onChange={(e) => {
                    handleStatusChange(selectedPendaftar.id, e.target.value)
                    setShowModal(false)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="submit">Submit</option>
                  <option value="review">Review</option>
                  <option value="accepted">Diterima</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  )
}