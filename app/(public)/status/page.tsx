'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface RegistrationData {
  nama_lengkap: string
  nik: string
  no_registrasi: string
  status: string
  status_dokumen: string
  catatan: string | null
  created_at: string
  updated_at: string
}

function StatusPageContent() {
  const searchParams = useSearchParams()
  const nikFromUrl = searchParams.get('nik')
  
  const [nik, setNik] = useState(nikFromUrl || '')
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!nik.trim()) {
      setError('Masukkan NIK Anda')
      return
    }

    if (nik.length !== 16) {
      setError('NIK harus 16 digit')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/public/status?nik=${nik}`)
      const data = await response.json()
      
      if (response.ok) {
        setRegistration(data)
      } else {
        setError(data.message || 'Pendaftaran tidak ditemukan')
        setRegistration(null)
      }
    } catch (error) {
      console.error('Error fetching status:', error)
      setError('Terjadi kesalahan saat mengecek status')
      setRegistration(null)
    } finally {
      setLoading(false)
    }
  }, [nik])

  useEffect(() => {
    if (nikFromUrl && nikFromUrl.length === 16) {
      handleSearch()
    }
  }, [nikFromUrl, handleSearch])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DITINJAU':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Sedang Ditinjau
          </Badge>
        )
      case 'DITERIMA':
        return (
          <Badge variant="default" className="bg-green-500 text-white">
            <CheckCircle className="w-4 h-4 mr-1" />
            Diterima
          </Badge>
        )
      case 'DITOLAK':
        return (
          <Badge variant="destructive">
            <XCircle className="w-4 h-4 mr-1" />
            Ditolak
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'LENGKAP':
        return <Badge variant="default" className="bg-green-500">Lengkap</Badge>
      case 'TIDAK_LENGKAP':
        return <Badge variant="destructive">Tidak Lengkap</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Status Pendaftaran PPDB
          </h1>
          <p className="text-gray-600">
            {nikFromUrl ? 'Status pendaftaran Anda' : 'Untuk mengecek status, gunakan tombol di halaman pendaftaran'}
          </p>
        </div>

        {/* Show search form only if no NIK in URL */}
        {!nikFromUrl && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cek Status Pendaftaran</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-2">
                    NIK (Nomor Induk Kependudukan)
                  </label>
                  <Input
                    id="nik"
                    type="text"
                    placeholder="Masukkan NIK 16 digit"
                    value={nik}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      if (value.length <= 16) {
                        setNik(value)
                      }
                    }}
                    maxLength={16}
                    className="text-center text-lg"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading || nik.length !== 16}
                >
                  {loading ? 'Mencari...' : 'Cek Status'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Tidak Ditemukan</h3>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/pendaftaran'}
                  className="px-6"
                >
                  Daftar Sekarang
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Status Display */}
        {registration && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {registration.status === 'DITERIMA' ? (
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  ) : registration.status === 'DITOLAK' ? (
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  ) : (
                    <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                  )}
                  {getStatusBadge(registration.status)}
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Informasi Pendaftaran</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nama:</span>
                      <span className="font-medium">{registration.nama_lengkap}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NIK:</span>
                      <span className="font-medium">{registration.nik}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">No. Registrasi:</span>
                      <span className="font-medium">{registration.no_registrasi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal Daftar:</span>
                      <span className="font-medium">
                        {new Date(registration.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Status Dokumen</h3>
                    {getDocumentStatusBadge(registration.status_dokumen)}
                  </div>
                  
                  {registration.catatan && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-800 text-sm">
                        <strong>Catatan dari Admin:</strong> {registration.catatan}
                      </p>
                    </div>
                  )}

                  {registration.status === 'DITERIMA' && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <h4 className="font-semibold text-green-900 mb-2">🎉 Selamat!</h4>
                      <p className="text-green-700 text-sm">
                        Pendaftaran Anda telah diterima. Silakan tunggu informasi lebih lanjut 
                        mengenai tahap selanjutnya dari sekolah.
                      </p>
                    </div>
                  )}

                  {registration.status === 'DITOLAK' && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                      <h4 className="font-semibold text-red-900 mb-2">Mohon Maaf</h4>
                      <p className="text-red-700 text-sm">
                        Pendaftaran Anda belum dapat diterima pada periode ini. 
                        {registration.catatan && (
                          <span> Silakan periksa catatan di atas untuk informasi lebih lanjut.</span>
                        )}
                      </p>
                    </div>
                  )}

                  {registration.status === 'DITINJAU' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="font-semibold text-blue-900 mb-2">⏳ Sedang Diproses</h4>
                      <p className="text-blue-700 text-sm">
                        Pendaftaran Anda sedang ditinjau oleh tim admin. 
                        Harap tunggu konfirmasi lebih lanjut.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Back to Registration */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/pendaftaran'}
            className="px-8"
          >
            Kembali ke Pendaftaran
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <StatusPageContent />
    </Suspense>
  )
}
