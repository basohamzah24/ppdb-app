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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-blue-700">Total Pendaftar</CardTitle>
            <div className="p-1.5 md:p-2 bg-blue-200 rounded-full">
              <Users className="h-3 w-3 md:h-4 md:w-4 text-blue-700" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex items-center space-x-2">
                <div className="text-xl md:text-2xl font-bold text-blue-700 animate-pulse">-</div>
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-blue-800 mb-1">{stats.totalPendaftar}</div>
            )}
            <p className="text-xs text-blue-600 font-medium">Siswa terdaftar</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-green-700">Pendaftar Baru</CardTitle>
            <div className="p-1.5 md:p-2 bg-green-200 rounded-full">
              <FileText className="h-3 w-3 md:h-4 md:w-4 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex items-center space-x-2">
                <div className="text-xl md:text-2xl font-bold text-green-700 animate-pulse">-</div>
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-green-800 mb-1">{stats.pendaftarBaru}</div>
            )}
            <p className="text-xs text-green-600 font-medium">Hari ini</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-purple-700">Dokumen Lengkap</CardTitle>
            <div className="p-1.5 md:p-2 bg-purple-200 rounded-full">
              <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-purple-700" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex items-center space-x-2">
                <div className="text-xl md:text-2xl font-bold text-purple-700 animate-pulse">-</div>
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-purple-800 mb-1">{stats.dokumenLengkap}</div>
            )}
            <p className="text-xs text-purple-600 font-medium">Siap verifikasi</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-orange-700">Menunggu Verifikasi</CardTitle>
            <div className="p-1.5 md:p-2 bg-orange-200 rounded-full">
              <Clock className="h-3 w-3 md:h-4 md:w-4 text-orange-700" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex items-center space-x-2">
                <div className="text-xl md:text-2xl font-bold text-orange-700 animate-pulse">-</div>
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-orange-800 mb-1">{stats.menungguVerifikasi}</div>
            )}
            <p className="text-xs text-orange-600 font-medium">Perlu tindakan</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8">
        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 hover:border-l-6 hover:translate-y-[-2px] bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-base md:text-lg">
              <div className="p-2 md:p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-sm md:text-base">Data Pendaftar</div>
                <div className="text-xs md:text-sm text-gray-500">Kelola siswa</div>
              </div>
            </CardTitle>
            <CardDescription className="text-gray-600 text-xs md:text-sm">
              Kelola dan verifikasi data pendaftar PPDB dengan mudah
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => router.push('/admin/pendaftar')}
              className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 hover:shadow-md text-xs md:text-sm" 
              variant="outline"
            >
              <Eye className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              Lihat Data Pendaftar
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-green-500 hover:border-l-6 hover:translate-y-[-2px] bg-gradient-to-br from-white to-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-base md:text-lg">
              <div className="p-2 md:p-3 bg-green-100 rounded-xl group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-sm md:text-base">Laporan</div>
                <div className="text-xs md:text-sm text-gray-500">Analisis data</div>
              </div>
            </CardTitle>
            <CardDescription className="text-gray-600 text-xs md:text-sm">
              Generate dan analisis laporan pendaftaran lengkap
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => router.push('/admin/laporan')}
              className="w-full group-hover:bg-green-600 group-hover:text-white transition-all duration-300 hover:shadow-md text-xs md:text-sm" 
              variant="outline"
            >
              <Download className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              Buat Laporan
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-purple-500 hover:border-l-6 hover:translate-y-[-2px] bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-base md:text-lg">
              <div className="p-2 md:p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                <Settings className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-sm md:text-base">Pengaturan</div>
                <div className="text-xs md:text-sm text-gray-500">Konfigurasi</div>
              </div>
            </CardTitle>
            <CardDescription className="text-gray-600 text-xs md:text-sm">
              Konfigurasi sistem dan konten website sekolah
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => router.push('/admin/pengaturan')}
              className="w-full group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 hover:shadow-md text-xs md:text-sm" 
              variant="outline"
            >
              <Settings className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              Kelola Pengaturan
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}