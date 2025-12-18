'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  Eye,
  Download,
  CheckCircle,
  Clock
} from 'lucide-react'

interface DashboardStats {
  totalPendaftar: number
  pendaftarBaru: number
  dokumenLengkap: number
  menungguVerifikasi: number
}

interface DashboardData {
  stats: DashboardStats
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPendaftar: 0,
    pendaftarBaru: 0,
    dokumenLengkap: 0,
    menungguVerifikasi: 0
  })
  const [loadingData, setLoadingData] = useState(true)
  
  const router = useRouter()

  useEffect(() => {
    // Load dashboard data immediately - auth sudah dihandle oleh middleware
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoadingData(true)
      console.log('Loading dashboard data...') // Debug log
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 detik timeout
      
      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data: DashboardData = await response.json()
        console.log('Dashboard data received:', data) // Debug log
        setStats(data.stats)
      } else {
        console.error('Failed to fetch dashboard data:', response.status)
        const errorData = await response.text()
        console.error('Error response:', errorData)
        
        // Fallback ke data kosong jika gagal
        setStats({
          totalPendaftar: 0,
          pendaftarBaru: 0,
          dokumenLengkap: 0,
          menungguVerifikasi: 0
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Fallback ke data kosong jika error
      setStats({
        totalPendaftar: 0,
        pendaftarBaru: 0,
        dokumenLengkap: 0,
        menungguVerifikasi: 0
      })
    } finally {
      setLoadingData(false)
    }
  }



  return (
    <AdminLayout 
      title="Dashboard" 
      subtitle="Ringkasan data penerimaan peserta didik baru"
    >
      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Pendaftar</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="text-2xl font-bold text-blue-700 animate-pulse">-</div>
            ) : (
              <div className="text-2xl font-bold text-blue-700">{stats.totalPendaftar}</div>
            )}
            <p className="text-xs text-blue-600 mt-1">Siswa terdaftar</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Pendaftar Baru</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="text-2xl font-bold text-green-700 animate-pulse">-</div>
            ) : (
              <div className="text-2xl font-bold text-green-700">{stats.pendaftarBaru}</div>
            )}
            <p className="text-xs text-green-600 mt-1">Hari ini</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Dokumen Lengkap</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="text-2xl font-bold text-purple-700 animate-pulse">-</div>
            ) : (
              <div className="text-2xl font-bold text-purple-700">{stats.dokumenLengkap}</div>
            )}
            <p className="text-xs text-purple-600 mt-1">Siap verifikasi</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Menunggu Verifikasi</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="text-2xl font-bold text-orange-700 animate-pulse">-</div>
            ) : (
              <div className="text-2xl font-bold text-orange-700">{stats.menungguVerifikasi}</div>
            )}
            <p className="text-xs text-orange-600 mt-1">Perlu tindakan</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500" onClick={() => router.push('/admin/pendaftar')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              Data Pendaftar
            </CardTitle>
            <CardDescription>
              Kelola dan verifikasi data pendaftar PPDB
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Lihat Data Pendaftar
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-green-500" onClick={() => router.push('/admin/laporan')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              Laporan
            </CardTitle>
            <CardDescription>
              Generate dan analisis laporan pendaftaran
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Buat Laporan
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-purple-500" onClick={() => router.push('/admin/pengaturan')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              Pengaturan
            </CardTitle>
            <CardDescription>
              Konfigurasi sistem dan konten website
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Kelola Pengaturan
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}