'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Calendar, 
  Users, 
  FileText, 
  Save,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface PPDBSettings {
  tahunAjaran: string
  statusPendaftaran: 'buka' | 'tutup'
  tanggalBuka: string
  tanggalTutup: string
  kuotaSiswa: number
  persyaratan: string[]
  alurPendaftaran: string[]
  informasiTambahan: string
}

export default function AdminPengaturan() {
  const [settings, setSettings] = useState<PPDBSettings>({
    tahunAjaran: '',
    statusPendaftaran: 'tutup',
    tanggalBuka: '',
    tanggalTutup: '',
    kuotaSiswa: 0,
    persyaratan: [],
    alurPendaftaran: [],
    informasiTambahan: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // State untuk form input
  const [newPersyaratan, setNewPersyaratan] = useState('')
  const [newAlur, setNewAlur] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/ppdb')
      const result = await response.json()
      
      if (result.success && result.data) {
        const data = result.data
        setSettings({
          tahunAjaran: data.tahunAjaran || '',
          statusPendaftaran: data.statusPendaftaran || 'tutup',
          tanggalBuka: data.tanggalBuka ? new Date(data.tanggalBuka).toISOString().split('T')[0] : '',
          tanggalTutup: data.tanggalTutup ? new Date(data.tanggalTutup).toISOString().split('T')[0] : '',
          kuotaSiswa: data.kuotaSiswa || 0,
          persyaratan: data.persyaratan || [],
          alurPendaftaran: data.alurPendaftaran || [],
          informasiTambahan: data.informasiTambahan || ''
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      setMessage({ type: 'error', text: 'Gagal memuat pengaturan' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      console.log('Menyimpan pengaturan:', settings)
      const response = await fetch('/api/admin/settings/ppdb', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      const result = await response.json()
      console.log('Response dari server:', result)
      
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Data berhasil disimpan ke database! Perubahan sudah permanen.' })
        
        // Revalidasi cache halaman publik
        try {
          await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: '/' })
          })
          console.log('Cache berhasil di-refresh')
        } catch (revalidateError) {
          console.warn('Revalidation failed:', revalidateError)
        }
        
        // Reload data dari database untuk memastikan sinkron
        await loadSettings()
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menyimpan pengaturan' })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan: ' + (error instanceof Error ? error.message : 'Unknown error') })
    } finally {
      setSaving(false)
    }
  }

  const addPersyaratan = () => {
    if (newPersyaratan.trim()) {
      setSettings(prev => ({
        ...prev,
        persyaratan: [...prev.persyaratan, newPersyaratan.trim()]
      }))
      setNewPersyaratan('')
    }
  }

  const removePersyaratan = (index: number) => {
    setSettings(prev => ({
      ...prev,
      persyaratan: prev.persyaratan.filter((_, i) => i !== index)
    }))
  }

  const addAlur = () => {
    if (newAlur.trim()) {
      setSettings(prev => ({
        ...prev,
        alurPendaftaran: [...prev.alurPendaftaran, newAlur.trim()]
      }))
      setNewAlur('')
    }
  }

  const removeAlur = (index: number) => {
    setSettings(prev => ({
      ...prev,
      alurPendaftaran: prev.alurPendaftaran.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <AdminLayout title="Pengaturan" subtitle="Memuat pengaturan...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Pengaturan PPDB" 
      subtitle="Konfigurasi pendaftaran dan konten website"
    >
      <div className="space-y-8">
        {/* Header Enhancement */}
        <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 p-8 rounded-xl border border-purple-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Pengaturan PPDB
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola pengaturan dan konfigurasi sistem PPDB
              </p>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="border-2 shadow-sm">
            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription className="font-medium">{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Basic Settings */}
        <Card className="shadow-sm border-2 hover:border-purple-200 transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg shadow-sm">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-800">Pengaturan Dasar</span>
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Konfigurasi dasar penerimaan peserta didik baru
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tahunAjaran" className="text-sm font-medium text-gray-700">Tahun Ajaran</Label>
                <Input
                  id="tahunAjaran"
                  value={settings.tahunAjaran}
                  onChange={(e) => setSettings(prev => ({ ...prev, tahunAjaran: e.target.value }))}
                  placeholder="2025/2026"
                  className="border-2 focus:border-purple-400 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kuotaSiswa" className="text-sm font-medium text-gray-700">Kuota Siswa</Label>
                <Input
                  id="kuotaSiswa"
                  type="number"
                  value={settings.kuotaSiswa}
                  onChange={(e) => setSettings(prev => ({ ...prev, kuotaSiswa: parseInt(e.target.value) || 0 }))}
                  placeholder="100"
                  className="border-2 focus:border-purple-400 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Settings */}
        <Card className="shadow-sm border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-sm">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-800">Jadwal Pendaftaran</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-100">
              <Label className="text-sm font-medium text-gray-700">Status Pendaftaran:</Label>
              <Badge 
                variant={settings.statusPendaftaran === 'buka' ? 'default' : 'secondary'} 
                className={`px-3 py-1 font-medium ${
                  settings.statusPendaftaran === 'buka' 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-red-100 text-red-700 border-red-200'
                }`}
              >
                {settings.statusPendaftaran === 'buka' ? 'Buka' : 'Tutup'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(prev => ({ 
                  ...prev, 
                  statusPendaftaran: prev.statusPendaftaran === 'buka' ? 'tutup' : 'buka' 
                }))}
                className="border-2 hover:border-blue-300 transition-colors"
              >
                {settings.statusPendaftaran === 'buka' ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tanggalBuka" className="text-sm font-medium text-gray-700">Tanggal Buka</Label>
                <Input
                  id="tanggalBuka"
                  type="date"
                  value={settings.tanggalBuka}
                  onChange={(e) => setSettings(prev => ({ ...prev, tanggalBuka: e.target.value }))}
                  className="border-2 focus:border-blue-400 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggalTutup" className="text-sm font-medium text-gray-700">Tanggal Tutup</Label>
                <Input
                  id="tanggalTutup"
                  type="date"
                  value={settings.tanggalTutup}
                  onChange={(e) => setSettings(prev => ({ ...prev, tanggalTutup: e.target.value }))}
                  className="border-2 focus:border-blue-400 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="shadow-sm border-2 hover:border-green-200 transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-800">Persyaratan Pendaftaran</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex gap-3">
              <Input
                value={newPersyaratan}
                onChange={(e) => setNewPersyaratan(e.target.value)}
                placeholder="Tambah persyaratan baru..."
                onKeyDown={(e) => e.key === 'Enter' && addPersyaratan()}
                className="border-2 focus:border-green-400 transition-colors"
              />
              <Button 
                onClick={addPersyaratan}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-sm px-6"
              >
                Tambah
              </Button>
            </div>
            
            <div className="space-y-3">
              {settings.persyaratan.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg border border-green-100 hover:border-green-200 transition-colors">
                  <span className="font-medium text-gray-700">{index + 1}. {item}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePersyaratan(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    Hapus
                  </Button>
                </div>
              ))}
              {settings.persyaratan.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Belum ada persyaratan</p>
                  <p className="text-gray-400 text-sm">Tambahkan persyaratan pendaftaran di atas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registration Flow */}
        <Card className="shadow-sm border-2 hover:border-orange-200 transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg shadow-sm">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-800">Alur Pendaftaran</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex gap-3">
              <Input
                value={newAlur}
                onChange={(e) => setNewAlur(e.target.value)}
                placeholder="Tambah langkah alur pendaftaran..."
                onKeyDown={(e) => e.key === 'Enter' && addAlur()}
                className="border-2 focus:border-orange-400 transition-colors"
              />
              <Button 
                onClick={addAlur}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white border-0 shadow-sm px-6"
              >
                Tambah
              </Button>
            </div>
            
            <div className="space-y-3">
              {settings.alurPendaftaran.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg border border-orange-100 hover:border-orange-200 transition-colors">
                  <span className="font-medium text-gray-700">{index + 1}. {item}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAlur(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    Hapus
                  </Button>
                </div>
              ))}
              {settings.alurPendaftaran.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Belum ada alur pendaftaran</p>
                  <p className="text-gray-400 text-sm">Tambahkan langkah alur pendaftaran di atas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="shadow-sm border-2 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-sm">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-800">Informasi Tambahan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="informasiTambahan" className="text-sm font-medium text-gray-700">
                Informasi yang akan ditampilkan di halaman publik
              </Label>
              <Textarea
                id="informasiTambahan"
                value={settings.informasiTambahan}
                onChange={(e) => setSettings(prev => ({ ...prev, informasiTambahan: e.target.value }))}
                placeholder="Informasi tambahan yang akan ditampilkan di halaman publik..."
                rows={4}
                className="border-2 focus:border-indigo-400 transition-colors resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="min-w-40 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-3" />
                Simpan Pengaturan
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}