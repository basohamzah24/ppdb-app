'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Eye, 
  Download,
  FileText,
  Image,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCw,
  MessageSquare,
  CheckSquare,
  Square,
  RefreshCw,
  AlertCircle,
  X
} from 'lucide-react'

interface Pendaftar {
  id: string
  noPendaftaran: string
  nama: string
  statusPendaftaran: string
  aktaKelahiran_nama?: string
  aktaKelahiran_path?: string
  aktaKelahiran_status?: string
  kartuKeluarga_nama?: string
  kartuKeluarga_path?: string
  kartuKeluarga_status?: string
  fotoSiswa_nama?: string
  fotoSiswa_path?: string
  fotoSiswa_status?: string
  tanggalDaftar: string
}

type DocumentType = 'akta_kelahiran' | 'kartu_keluarga' | 'foto_siswa'

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'info'
}

interface RejectionModal {
  show: boolean
  pendaftarId: string
  documentType: DocumentType
  documentName: string
  reason: string
}

export default function AdminVerifikasi() {
  const [pendaftarList, setPendaftarList] = useState<Pendaftar[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [imageZoom, setImageZoom] = useState(1)
  const [imageRotation, setImageRotation] = useState(0)
  
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' })
  const [rejectionModal, setRejectionModal] = useState<RejectionModal>({
    show: false, pendaftarId: '', documentType: 'akta_kelahiran', documentName: '', reason: ''
  })
  
  const [selectedDocument, setSelectedDocument] = useState<{
    pendaftarId: string
    nama: string
    noPendaftaran: string
    documentType: DocumentType
    documentName: string
    documentPath: string
    currentStatus: string
  } | null>(null)
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // Debounce search term
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchTerm])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 5000)
  }, [])

  const fetchPendaftar = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: statusFilter === 'all' ? '' : statusFilter,
        search: debouncedSearchTerm
      })

      const response = await fetch(`/api/admin/pendaftar?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setPendaftarList(data.data)
        setTotalPages(Math.ceil(data.total / 10))
      } else {
        showToast('Gagal memuat data pendaftar', 'error')
      }
    } catch (error) {
      console.error('Error fetching pendaftar:', error)
      showToast('Terjadi kesalahan saat memuat data', 'error')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPendaftar()
  }, [currentPage, statusFilter, debouncedSearchTerm])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, debouncedSearchTerm])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Disetujui
        </Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Ditolak
        </Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          Menunggu
        </Badge>
    }
  }

  const getDocumentIcon = (documentType: DocumentType, fileName?: string) => {
    if (!fileName) return <FileText className="w-4 h-4" />
    
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) {
      return <Image className="w-4 h-4" />
    }
    return <FileText className="w-4 h-4" />
  }

  const handleDocumentAction = async (
    pendaftarId: string, 
    documentType: DocumentType, 
    action: 'approved' | 'rejected',
    reason?: string
  ) => {
    setIsUpdating(true)
    try {
      const payload: any = {
        id: pendaftarId,
        dokumenType: documentType,
        dokumenStatus: action
      }
      
      if (action === 'rejected' && reason) {
        payload.rejectionReason = reason
      }

      const response = await fetch('/api/admin/pendaftar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        // Optimistic update
        setPendaftarList(prev => prev.map(p => {
          if (p.id === pendaftarId) {
            const statusField = `${documentType}_status` as keyof Pendaftar
            return { ...p, [statusField]: action }
          }
          return p
        }))
        
        setSelectedDocument(null)
        setRejectionModal({ show: false, pendaftarId: '', documentType: 'akta_kelahiran', documentName: '', reason: '' })
        showToast(`Dokumen berhasil ${action === 'approved' ? 'disetujui' : 'ditolak'}`, 'success')
        
        // Refresh to ensure data consistency
        setTimeout(fetchPendaftar, 1000)
      } else {
        const errorData = await response.json()
        showToast(errorData.error || 'Gagal memperbarui status dokumen', 'error')
      }
    } catch (error) {
      console.error('Error updating document:', error)
      showToast('Terjadi kesalahan saat memperbarui dokumen', 'error')
    }
    setIsUpdating(false)
  }

  const handleBulkAction = async () => {
    if (selectedItems.size === 0 || !bulkAction) return
    
    setIsUpdating(true)
    let successCount = 0
    let errorCount = 0
    
    for (const pendaftarId of selectedItems) {
      const pendaftar = pendaftarList.find(p => p.id === pendaftarId)
      if (!pendaftar) continue
      
      // Process all pending documents for this pendaftar
      const documentsToProcess: DocumentType[] = []
      if (pendaftar.aktaKelahiran_status === 'pending') documentsToProcess.push('akta_kelahiran')
      if (pendaftar.kartuKeluarga_status === 'pending') documentsToProcess.push('kartu_keluarga')
      if (pendaftar.fotoSiswa_status === 'pending') documentsToProcess.push('foto_siswa')
      
      for (const docType of documentsToProcess) {
        try {
          const response = await fetch('/api/admin/pendaftar', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: pendaftarId,
              dokumenType: docType,
              dokumenStatus: bulkAction
            })
          })
          
          if (response.ok) {
            successCount++
          } else {
            errorCount++
          }
        } catch {
          errorCount++
        }
      }
    }
    
    setSelectedItems(new Set())
    setBulkAction('')
    setIsUpdating(false)
    
    if (successCount > 0) {
      showToast(`${successCount} dokumen berhasil diperbarui`, 'success')
    }
    if (errorCount > 0) {
      showToast(`${errorCount} dokumen gagal diperbarui`, 'error')
    }
    
    fetchPendaftar()
  }

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedItems.size === pendaftarList.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(pendaftarList.map(p => p.id)))
    }
  }

  const handleRejectWithReason = (pendaftarId: string, documentType: DocumentType, documentName: string) => {
    setRejectionModal({
      show: true,
      pendaftarId,
      documentType,
      documentName,
      reason: ''
    })
  }

  const openDocumentModal = (
    pendaftar: Pendaftar, 
    documentType: DocumentType
  ) => {
    const docData = {
      akta_kelahiran: {
        name: pendaftar.aktaKelahiran_nama,
        path: pendaftar.aktaKelahiran_path,
        status: pendaftar.aktaKelahiran_status
      },
      kartu_keluarga: {
        name: pendaftar.kartuKeluarga_nama,
        path: pendaftar.kartuKeluarga_path,
        status: pendaftar.kartuKeluarga_status
      },
      foto_siswa: {
        name: pendaftar.fotoSiswa_nama,
        path: pendaftar.fotoSiswa_path,
        status: pendaftar.fotoSiswa_status
      }
    }

    const doc = docData[documentType]
    if (doc.name && doc.path) {
      // Reset zoom and rotation when opening new document
      setImageZoom(1)
      setImageRotation(0)
      
      setSelectedDocument({
        pendaftarId: pendaftar.id,
        nama: pendaftar.nama,
        noPendaftaran: pendaftar.noPendaftaran,
        documentType,
        documentName: doc.name,
        documentPath: doc.path,
        currentStatus: doc.status || 'pending'
      })
    }
  }

  const getDocumentTypeLabel = (type: DocumentType) => {
    switch (type) {
      case 'akta_kelahiran': return 'Akta Kelahiran'
      case 'kartu_keluarga': return 'Kartu Keluarga'
      case 'foto_siswa': return 'Foto Siswa 3x4'
      default: return type
    }
  }

  const countPendingDocuments = () => {
    let count = 0
    pendaftarList.forEach(pendaftar => {
      if (pendaftar.aktaKelahiran_status === 'pending') count++
      if (pendaftar.kartuKeluarga_status === 'pending') count++
      if (pendaftar.fotoSiswa_status === 'pending') count++
    })
    return count
  }

  return (
    <AdminLayout 
      title="Verifikasi Dokumen" 
      subtitle="Verifikasi dokumen dan data pendaftar"
    >
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        } animate-in slide-in-from-right duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
              {toast.type === 'info' && <AlertCircle className="w-5 h-5 mr-2" />}
              <span className="font-medium">{toast.message}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setToast({ show: false, message: '', type: 'info' })}
              className="p-1 h-6 w-6 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pendaftar</p>
                <p className="text-2xl font-semibold">{pendaftarList.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dokumen Menunggu</p>
                <p className="text-2xl font-semibold text-yellow-600">{countPendingDocuments()}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Disetujui</p>
                <p className="text-2xl font-semibold text-green-600">
                  {pendaftarList.reduce((acc, p) => 
                    acc + 
                    (p.aktaKelahiran_status === 'approved' ? 1 : 0) +
                    (p.kartuKeluarga_status === 'approved' ? 1 : 0) +
                    (p.fotoSiswa_status === 'approved' ? 1 : 0), 0
                  )}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ditolak</p>
                <p className="text-2xl font-semibold text-red-600">
                  {pendaftarList.reduce((acc, p) => 
                    acc + 
                    (p.aktaKelahiran_status === 'rejected' ? 1 : 0) +
                    (p.kartuKeluarga_status === 'rejected' ? 1 : 0) +
                    (p.fotoSiswa_status === 'rejected' ? 1 : 0), 0
                  )}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama atau no pendaftaran..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {searchTerm !== debouncedSearchTerm && (
                    <div className="absolute right-3 top-3">
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-64 relative">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu Verifikasi</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                onClick={fetchPendaftar} 
                disabled={loading}
                className="whitespace-nowrap"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {/* Bulk Actions */}
            {selectedItems.size > 0 && (
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border">
                <span className="text-sm font-medium text-blue-700">
                  {selectedItems.size} item dipilih
                </span>
                <div className="flex items-center gap-2 relative">
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Pilih aksi..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Setujui Semua</SelectItem>
                      <SelectItem value="rejected">Tolak Semua</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleBulkAction}
                    disabled={!bulkAction || isUpdating}
                    size="sm"
                  >
                    {isUpdating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckSquare className="h-4 w-4 mr-2" />
                    )}
                    Terapkan
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedItems(new Set())}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Verification Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Dokumen Pendaftar</CardTitle>
          <CardDescription>
            Klik pada dokumen untuk melakukan verifikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : pendaftarList.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada data pendaftar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 w-12">
                      <button
                        onClick={toggleSelectAll}
                        className="flex items-center justify-center w-5 h-5 border rounded hover:bg-gray-100"
                      >
                        {selectedItems.size === pendaftarList.length && pendaftarList.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : selectedItems.size > 0 ? (
                          <div className="w-2 h-2 bg-blue-600 rounded" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="text-left p-3 font-medium">No. Pendaftaran</th>
                    <th className="text-left p-3 font-medium">Nama</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Akta Kelahiran</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Kartu Keluarga</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Foto Siswa</th>
                    <th className="text-left p-3 font-medium md:hidden">Dokumen</th>
                    <th className="text-left p-3 font-medium hidden sm:table-cell">Tanggal Daftar</th>
                  </tr>
                </thead>
                <tbody>
                  {pendaftarList.map((pendaftar) => (
                    <tr key={pendaftar.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <button
                          onClick={() => toggleSelectItem(pendaftar.id)}
                          className="flex items-center justify-center w-5 h-5 border rounded hover:bg-gray-100"
                        >
                          {selectedItems.has(pendaftar.id) ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 font-medium text-blue-600">
                        {pendaftar.noPendaftaran}
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{pendaftar.nama}</div>
                          <div className="text-sm text-gray-500">
                            Status: {pendaftar.statusPendaftaran}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        {pendaftar.aktaKelahiran_nama ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => openDocumentModal(pendaftar, 'akta_kelahiran')}
                            >
                              {getDocumentIcon('akta_kelahiran', pendaftar.aktaKelahiran_nama)}
                              <span className="ml-1 truncate max-w-20">
                                {pendaftar.aktaKelahiran_nama}
                              </span>
                            </Button>
                            {getStatusBadge(pendaftar.aktaKelahiran_status || 'pending')}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Belum upload</span>
                        )}
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        {pendaftar.kartuKeluarga_nama ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => openDocumentModal(pendaftar, 'kartu_keluarga')}
                            >
                              {getDocumentIcon('kartu_keluarga', pendaftar.kartuKeluarga_nama)}
                              <span className="ml-1 truncate max-w-20">
                                {pendaftar.kartuKeluarga_nama}
                              </span>
                            </Button>
                            {getStatusBadge(pendaftar.kartuKeluarga_status || 'pending')}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Belum upload</span>
                        )}
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        {pendaftar.fotoSiswa_nama ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => openDocumentModal(pendaftar, 'foto_siswa')}
                            >
                              {getDocumentIcon('foto_siswa', pendaftar.fotoSiswa_nama)}
                              <span className="ml-1 truncate max-w-20">
                                {pendaftar.fotoSiswa_nama}
                              </span>
                            </Button>
                            {getStatusBadge(pendaftar.fotoSiswa_status || 'pending')}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Belum upload</span>
                        )}
                      </td>
                      {/* Mobile responsive document column */}
                      <td className="p-3 md:hidden">
                        <div className="space-y-2">
                          {[                            
                            { name: pendaftar.aktaKelahiran_nama, status: pendaftar.aktaKelahiran_status, type: 'akta_kelahiran' as DocumentType, label: 'Akta' },
                            { name: pendaftar.kartuKeluarga_nama, status: pendaftar.kartuKeluarga_status, type: 'kartu_keluarga' as DocumentType, label: 'KK' },
                            { name: pendaftar.fotoSiswa_nama, status: pendaftar.fotoSiswa_status, type: 'foto_siswa' as DocumentType, label: 'Foto' }
                          ].map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="font-medium">{doc.label}:</span>
                              {doc.name ? (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-1 text-xs"
                                    onClick={() => openDocumentModal(pendaftar, doc.type)}
                                  >
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                  {getStatusBadge(doc.status || 'pending')}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-500 hidden sm:table-cell">
                        {new Date(pendaftar.tanggalDaftar).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Document Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex-shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {getDocumentTypeLabel(selectedDocument.documentType)}
                  </h3>
                  <p className="text-gray-600">
                    {selectedDocument.nama} - {selectedDocument.noPendaftaran}
                  </p>
                  <p className="text-sm text-gray-500">
                    File: {selectedDocument.documentName}
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(selectedDocument.currentStatus)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!selectedDocument.documentName.toLowerCase().includes('.pdf') && (
                    <div className="flex items-center gap-1 border rounded px-2 py-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageZoom(prev => Math.max(0.5, prev - 0.25))}
                        disabled={imageZoom <= 0.5}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm px-2">{Math.round(imageZoom * 100)}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageZoom(prev => Math.min(3, prev + 0.25))}
                        disabled={imageZoom >= 3}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <div className="border-l pl-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setImageRotation(prev => (prev + 90) % 360)}
                          className="h-8 w-8 p-0"
                        >
                          <RotateCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDocument(null)
                      setImageZoom(1)
                      setImageRotation(0)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <div className="text-center">
                {selectedDocument.documentName.toLowerCase().includes('.pdf') ? (
                  <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">File PDF - Klik download untuk melihat</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = selectedDocument.documentPath
                        link.download = selectedDocument.documentName
                        link.click()
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-gray-50 overflow-auto" style={{ maxHeight: '60vh' }}>
                    <div
                      className="inline-block transition-transform duration-200"
                      style={{
                        transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                        transformOrigin: 'center'
                      }}
                    >
                      <img
                        src={selectedDocument.documentPath}
                        alt={selectedDocument.documentName}
                        className="max-w-full h-auto mx-auto object-contain shadow-lg"
                        style={{ maxHeight: '70vh' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement!.innerHTML = `
                            <div class="border-2 border-dashed border-gray-300 p-8 rounded-lg bg-white">
                              <div class="w-16 h-16 bg-gray-200 rounded mx-auto mb-4 flex items-center justify-center">
                                <span class="text-gray-400 text-2xl">?</span>
                              </div>
                              <p class="text-gray-500">Tidak dapat memuat gambar</p>
                              <p class="text-sm text-gray-400 mt-2">Periksa koneksi atau format file</p>
                            </div>
                          `
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 p-6 border-t bg-gray-50">
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => handleDocumentAction(
                    selectedDocument.pendaftarId,
                    selectedDocument.documentType,
                    'approved'
                  )}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={selectedDocument.currentStatus === 'approved' || isUpdating}
                >
                  {isUpdating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Setujui Dokumen
                </Button>
                <Button
                  onClick={() => handleRejectWithReason(
                    selectedDocument.pendaftarId,
                    selectedDocument.documentType,
                    selectedDocument.documentName
                  )}
                  variant="destructive"
                  disabled={selectedDocument.currentStatus === 'rejected' || isUpdating}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Tolak dengan Alasan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Rejection Reason Modal */}
      {rejectionModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Alasan Penolakan</h3>
              <p className="text-gray-600 text-sm mt-1">
                {getDocumentTypeLabel(rejectionModal.documentType)} - {rejectionModal.documentName}
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Berikan alasan penolakan dokumen:
                </label>
                <Textarea
                  value={rejectionModal.reason}
                  onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Contoh: Gambar tidak jelas, dokumen tidak sesuai, dll..."
                  rows={4}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setRejectionModal({ show: false, pendaftarId: '', documentType: 'akta_kelahiran', documentName: '', reason: '' })}
                >
                  Batal
                </Button>
                <Button
                  onClick={() => {
                    if (rejectionModal.reason.trim()) {
                      handleDocumentAction(
                        rejectionModal.pendaftarId,
                        rejectionModal.documentType,
                        'rejected',
                        rejectionModal.reason
                      )
                    } else {
                      showToast('Mohon berikan alasan penolakan', 'error')
                    }
                  }}
                  variant="destructive"
                  disabled={!rejectionModal.reason.trim() || isUpdating}
                >
                  {isUpdating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Tolak Dokumen
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}