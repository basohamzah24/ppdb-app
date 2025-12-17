'use client'

import { useState, useEffect, useMemo } from 'react'

interface JadwalItem {
  id: string
  nama: string
  deskripsi: string
  tanggalMulai: string
  tanggalSelesai: string
  waktuMulai: string
  waktuSelesai: string
  status: 'upcoming' | 'active' | 'completed'
  tipe: 'pendaftaran' | 'verifikasi' | 'pengumuman' | 'daftar-ulang' | 'lainnya'
  lokasi?: string
  catatan?: string
}

export default function JadwalPPDB() {
  const [jadwalItems, setJadwalItems] = useState<JadwalItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<JadwalItem | null>(null)
  const [filters, setFilters] = useState({
    status: 'all',
    tipe: 'all',
    search: ''
  })

  const [formData, setFormData] = useState<{
    nama: string
    deskripsi: string
    tanggalMulai: string
    tanggalSelesai: string
    waktuMulai: string
    waktuSelesai: string
    tipe: 'pendaftaran' | 'verifikasi' | 'pengumuman' | 'daftar-ulang' | 'lainnya'
    lokasi: string
    catatan: string
  }>({
    nama: '',
    deskripsi: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    waktuMulai: '08:00',
    waktuSelesai: '16:00',
    tipe: 'pendaftaran',
    lokasi: '',
    catatan: ''
  })

  useEffect(() => {
    // Simulasi fetch data
    const dummyData: JadwalItem[] = [
      {
        id: '1',
        nama: 'Pembukaan Pendaftaran Online',
        deskripsi: 'Mulai pendaftaran PPDB Online untuk tahun ajaran 2024/2025',
        tanggalMulai: '2024-01-01',
        tanggalSelesai: '2024-05-31',
        waktuMulai: '00:00',
        waktuSelesai: '23:59',
        status: 'active',
        tipe: 'pendaftaran'
      },
      {
        id: '2',
        nama: 'Sosialisasi PPDB',
        deskripsi: 'Sosialisasi sistem PPDB Online kepada masyarakat',
        tanggalMulai: '2024-01-15',
        tanggalSelesai: '2024-01-15',
        waktuMulai: '09:00',
        waktuSelesai: '12:00',
        status: 'completed',
        tipe: 'lainnya',
        lokasi: 'Aula UPT SD Negeri 061 Sumpira'
      },
      {
        id: '3',
        nama: 'Verifikasi Berkas',
        deskripsi: 'Periode verifikasi berkas oleh admin sekolah',
        tanggalMulai: '2024-06-01',
        tanggalSelesai: '2024-06-15',
        waktuMulai: '08:00',
        waktuSelesai: '15:00',
        status: 'upcoming',
        tipe: 'verifikasi',
        catatan: 'Berkas yang tidak lengkap akan dikembalikan untuk diperbaiki'
      },
      {
        id: '4',
        nama: 'Pengumuman Hasil Seleksi',
        deskripsi: 'Pengumuman siswa yang diterima di UPT SD Negeri 061 Sumpira',
        tanggalMulai: '2024-06-20',
        tanggalSelesai: '2024-06-20',
        waktuMulai: '10:00',
        waktuSelesai: '10:00',
        status: 'upcoming',
        tipe: 'pengumuman'
      },
      {
        id: '5',
        nama: 'Daftar Ulang',
        deskripsi: 'Periode daftar ulang untuk siswa yang diterima',
        tanggalMulai: '2024-06-25',
        tanggalSelesai: '2024-07-05',
        waktuMulai: '08:00',
        waktuSelesai: '14:00',
        status: 'upcoming',
        tipe: 'daftar-ulang',
        lokasi: 'Kantor UPT SD Negeri 061 Sumpira'
      }
    ]

    setTimeout(() => {
      setJadwalItems(dummyData)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredItems = useMemo(() => {
    const filtered = jadwalItems.filter(item => {
      const matchesStatus = filters.status === 'all' || item.status === filters.status
      const matchesTipe = filters.tipe === 'all' || item.tipe === filters.tipe
      const matchesSearch = !filters.search || 
        item.nama.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(filters.search.toLowerCase())
      
      return matchesStatus && matchesTipe && matchesSearch
    })

    // Sort by date
    return filtered.sort((a, b) => new Date(a.tanggalMulai).getTime() - new Date(b.tanggalSelesai).getTime())
  }, [jadwalItems, filters])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate ID hanya jika bukan editing (menambah item baru)
    const generateId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
      }
      // Fallback untuk environment yang tidak support crypto.randomUUID
      return 'jadwal-' + Math.random().toString(36).substr(2, 16)
    }
    
    const newItem: JadwalItem = {
      id: editingItem?.id || generateId(),
      ...formData,
      status: determineStatus(formData.tanggalMulai, formData.tanggalSelesai)
    }

    if (editingItem) {
      setJadwalItems(prev => prev.map(item => 
        item.id === editingItem.id ? newItem : item
      ))
    } else {
      setJadwalItems(prev => [...prev, newItem])
    }

    resetForm()
  }

  const determineStatus = (tanggalMulai: string, tanggalSelesai: string): 'upcoming' | 'active' | 'completed' => {
    const today = new Date()
    const start = new Date(tanggalMulai)
    const end = new Date(tanggalSelesai)
    
    if (today < start) return 'upcoming'
    if (today > end) return 'completed'
    return 'active'
  }

  const resetForm = () => {
    setFormData({
      nama: '',
      deskripsi: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      waktuMulai: '08:00',
      waktuSelesai: '16:00',
      tipe: 'pendaftaran',
      lokasi: '',
      catatan: ''
    })
    setEditingItem(null)
    setShowModal(false)
  }

  const handleEdit = (item: JadwalItem) => {
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi,
      tanggalMulai: item.tanggalMulai,
      tanggalSelesai: item.tanggalSelesai,
      waktuMulai: item.waktuMulai,
      waktuSelesai: item.waktuSelesai,
      tipe: item.tipe,
      lokasi: item.lokasi || '',
      catatan: item.catatan || ''
    })
    setEditingItem(item)
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      setJadwalItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Akan Datang</span>
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Berlangsung</span>
      case 'completed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Selesai</span>
      default:
        return null
    }
  }

  const getTipeBadge = (tipe: string) => {
    const colors = {
      pendaftaran: 'bg-blue-100 text-blue-800',
      verifikasi: 'bg-yellow-100 text-yellow-800',
      pengumuman: 'bg-green-100 text-green-800',
      'daftar-ulang': 'bg-purple-100 text-purple-800',
      lainnya: 'bg-gray-100 text-gray-800'
    }
    
    const labels = {
      pendaftaran: 'Pendaftaran',
      verifikasi: 'Verifikasi',
      pengumuman: 'Pengumuman',
      'daftar-ulang': 'Daftar Ulang',
      lainnya: 'Lainnya'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[tipe as keyof typeof colors]}`}>
        {labels[tipe as keyof typeof labels]}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat jadwal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Jadwal PPDB</h1>
            <p className="text-gray-600">Kelola jadwal kegiatan PPDB</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Tambah Jadwal
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari Jadwal</label>
            <input
              type="text"
              placeholder="Nama atau deskripsi..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="upcoming">Akan Datang</option>
              <option value="active">Berlangsung</option>
              <option value="completed">Selesai</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
            <select
              value={filters.tipe}
              onChange={(e) => setFilters(prev => ({ ...prev, tipe: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Tipe</option>
              <option value="pendaftaran">Pendaftaran</option>
              <option value="verifikasi">Verifikasi</option>
              <option value="pengumuman">Pengumuman</option>
              <option value="daftar-ulang">Daftar Ulang</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jadwal List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{item.nama}</h3>
                  {getTipeBadge(item.tipe)}
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-gray-600 mb-4">{item.deskripsi}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M8 7h8m0 0v11a2 2 0 01-2 2H10a2 2 0 01-2-2V7" />
                      </svg>
                      <span>
                        {new Date(item.tanggalMulai).toLocaleDateString('id-ID')}
                        {item.tanggalMulai !== item.tanggalSelesai && 
                          ` - ${new Date(item.tanggalSelesai).toLocaleDateString('id-ID')}`
                        }
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{item.waktuMulai} - {item.waktuSelesai} WIB</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {item.lokasi && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{item.lokasi}</span>
                      </div>
                    )}
                    {item.catatan && (
                      <div className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span>{item.catatan}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M8 7h8m0 0v11a2 2 0 01-2 2H10a2 2 0 01-2-2V7" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada jadwal</h3>
            <p className="mt-1 text-sm text-gray-500">Belum ada jadwal yang dibuat.</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingItem ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kegiatan</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama kegiatan..."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deskripsi kegiatan..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Kegiatan</label>
                  <select
                    value={formData.tipe}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipe: e.target.value as JadwalItem['tipe'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pendaftaran">Pendaftaran</option>
                    <option value="verifikasi">Verifikasi</option>
                    <option value="pengumuman">Pengumuman</option>
                    <option value="daftar-ulang">Daftar Ulang</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi (Opsional)</label>
                  <input
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) => setFormData(prev => ({ ...prev, lokasi: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Lokasi kegiatan..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={formData.tanggalMulai}
                    onChange={(e) => setFormData(prev => ({ ...prev, tanggalMulai: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={formData.tanggalSelesai}
                    onChange={(e) => setFormData(prev => ({ ...prev, tanggalSelesai: e.target.value }))}
                    required
                    min={formData.tanggalMulai}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Mulai</label>
                  <input
                    type="time"
                    value={formData.waktuMulai}
                    onChange={(e) => setFormData(prev => ({ ...prev, waktuMulai: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Selesai</label>
                  <input
                    type="time"
                    value={formData.waktuSelesai}
                    onChange={(e) => setFormData(prev => ({ ...prev, waktuSelesai: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
                  <textarea
                    value={formData.catatan}
                    onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Catatan tambahan..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  {editingItem ? 'Update' : 'Simpan'} Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

