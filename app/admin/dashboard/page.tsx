'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  LogOut,
  Eye,
  Download
} from 'lucide-react'

interface DashboardStats {
  totalPendaftar: number
}

interface DashboardData {
  stats: DashboardStats
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalPendaftar: 0
  })
  const [loadingData, setLoadingData] = useState(true)
  
  const router = useRouter()

  const verifySession = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/verify')
      
      if (response.ok) {
        const data = await response.json()
        if (data.isValid) {
          setIsAuthenticated(true)
          setIsLoading(false)
          loadDashboardData()
        } else {
          router.push('/admin/login')
        }
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Session verification error:', error)
      router.push('/admin/login')
    }
  }, [router])

  useEffect(() => {
    // Verify session dengan API call
    verifySession()
  }, [verifySession])

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
          totalPendaftar: 0
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Fallback ke data kosong jika error
      setStats({
        totalPendaftar: 0
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      // Redirect ke login setelah logout
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Tetap redirect meski ada error
      window.location.href = '/admin/login'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Memuat dashboard...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard Admin PPDB</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Selamat datang, Admin</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Total Pendaftar */}
        <div className="mb-8">
          <Card className="bg-blue-50 border-blue-200 max-w-md mx-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-blue-600">Total Pendaftar PPDB</CardTitle>
              <Users className="h-6 w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="text-4xl font-bold text-blue-700 animate-pulse text-center py-4">-</div>
              ) : (
                <div className="text-4xl font-bold text-blue-700 text-center py-4">{stats.totalPendaftar}</div>
              )}
              <p className="text-sm text-blue-600 mt-2 text-center">Total siswa yang telah mendaftar</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/pendaftar')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-blue-600" />
                Data Pendaftar
              </CardTitle>
              <CardDescription>
                Lihat dan kelola data pendaftar PPDB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Lihat Semua Pendaftar
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/laporan')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Laporan PPDB
              </CardTitle>
              <CardDescription>
                Generate dan download laporan pendaftaran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Laporan
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/pengaturan')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5 text-purple-600" />
                Pengaturan
              </CardTitle>
              <CardDescription>
                Kelola konten website dan pengaturan PPDB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Buka Pengaturan
              </Button>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  )
}