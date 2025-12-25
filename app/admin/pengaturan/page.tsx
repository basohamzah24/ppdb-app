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
      <div className="space-y-6">
        {/* Alert Messages */}
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Pengaturan Dasar
            </CardTitle>
            <CardDescription>
              Konfigurasi dasar penerimaan peserta didik baru
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tahunAjaran">Tahun Ajaran</Label>
                <Input
                  id="tahunAjaran"
                  value={settings.tahunAjaran}
                  onChange={(e) => setSettings(prev => ({ ...prev, tahunAjaran: e.target.value }))}
                  placeholder="2025/2026"
                />
              </div>
              <div>
                <Label htmlFor="kuotaSiswa">Kuota Siswa</Label>
                <Input
                  id="kuotaSiswa"
                  type="number"
                  value={settings.kuotaSiswa}
                  onChange={(e) => setSettings(prev => ({ ...prev, kuotaSiswa: parseInt(e.target.value) || 0 }))}
                  placeholder="100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Jadwal Pendaftaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Label>Status:</Label>
              <Badge variant={settings.statusPendaftaran === 'buka' ? 'default' : 'secondary'}>
                {settings.statusPendaftaran === 'buka' ? 'Buka' : 'Tutup'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(prev => ({ 
                  ...prev, 
                  statusPendaftaran: prev.statusPendaftaran === 'buka' ? 'tutup' : 'buka' 
                }))}
              >
                {settings.statusPendaftaran === 'buka' ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tanggalBuka">Tanggal Buka</Label>
                <Input
                  id="tanggalBuka"
                  type="date"
                  value={settings.tanggalBuka}
                  onChange={(e) => setSettings(prev => ({ ...prev, tanggalBuka: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tanggalTutup">Tanggal Tutup</Label>
                <Input
                  id="tanggalTutup"
                  type="date"
                  value={settings.tanggalTutup}
                  onChange={(e) => setSettings(prev => ({ ...prev, tanggalTutup: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Persyaratan Pendaftaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newPersyaratan}
                onChange={(e) => setNewPersyaratan(e.target.value)}
                placeholder="Tambah persyaratan baru..."
                onKeyDown={(e) => e.key === 'Enter' && addPersyaratan()}
              />
              <Button onClick={addPersyaratan}>Tambah</Button>
            </div>
            
            <div className="space-y-2">
              {settings.persyaratan.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{index + 1}. {item}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePersyaratan(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Hapus
                  </Button>
                </div>
              ))}
              {settings.persyaratan.length === 0 && (
                <p className="text-gray-500 text-center py-4">Belum ada persyaratan</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registration Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Alur Pendaftaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newAlur}
                onChange={(e) => setNewAlur(e.target.value)}
                placeholder="Tambah langkah alur pendaftaran..."
                onKeyDown={(e) => e.key === 'Enter' && addAlur()}
              />
              <Button onClick={addAlur}>Tambah</Button>
            </div>
            
            <div className="space-y-2">
              {settings.alurPendaftaran.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{index + 1}. {item}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAlur(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Hapus
                  </Button>
                </div>
              ))}
              {settings.alurPendaftaran.length === 0 && (
                <p className="text-gray-500 text-center py-4">Belum ada alur pendaftaran</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Tambahan</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={settings.informasiTambahan}
              onChange={(e) => setSettings(prev => ({ ...prev, informasiTambahan: e.target.value }))}
              placeholder="Informasi tambahan yang akan ditampilkan di halaman publik..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="min-w-32"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Pengaturan
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}