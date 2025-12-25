'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Users, 
  FileText, 
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Settings
} from 'lucide-react'

interface DashboardStats {
  totalPendaftar: number
  pendaftarBaru: number
  dokumenLengkap: number
  menungguVerifikasi: number
}

interface ActivityItem {
  id: string
  message: string
  time: string
  type: 'pendaftar' | 'dokumen' | 'system'
  icon: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPendaftar: 0,
    pendaftarBaru: 0,
    dokumenLengkap: 0,
    menungguVerifikasi: 0
  })
  const [loadingData, setLoadingData] = useState(true)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    loadDashboardData()
    
    // Auto refresh setiap 30 detik
    const interval = setInterval(() => {
      loadDashboardData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoadingData(true)
      console.log('Loading dashboard data...')
      
      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const result = await response.json()
      
      console.log('Dashboard API response:', result) // Debug log
      
      if (response.ok && result.stats) {
        console.log('Setting stats:', result.stats) // Debug log
        setStats(result.stats)
        
        // Generate activity items based on stats
        const newActivities: ActivityItem[] = [
          {
            id: '1',
            message: `${result.stats.pendaftarBaru} pendaftar baru hari ini`,
            time: new Date().toLocaleTimeString('id-ID'),
            type: 'pendaftar',
            icon: '🟢'
          },
          {
            id: '2',
            message: `${result.stats.menungguVerifikasi} dokumen menunggu verifikasi`,
            time: new Date().toLocaleTimeString('id-ID'),
            type: 'dokumen',
            icon: '🔵'
          },
          {
            id: '3',
            message: `${result.stats.dokumenLengkap} pendaftar telah melengkapi dokumen`,
            time: new Date().toLocaleTimeString('id-ID'),
            type: 'system',
            icon: '🟡'
          }
        ]
        setActivities(newActivities)
        setLastRefresh(new Date())
      } else {
        console.error('Failed to load dashboard data:', result)
        // Set fallback data jika gagal
        setStats({
          totalPendaftar: 0,
          pendaftarBaru: 0,
          dokumenLengkap: 0,
          menungguVerifikasi: 0
        })
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
      // Set fallback data jika error
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

  const statCards = [
    {
      title: 'Total Pendaftar',
      value: stats.totalPendaftar,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Pendaftar Baru',
      value: stats.pendaftarBaru,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Dokumen Lengkap',
      value: stats.dokumenLengkap,
      icon: CheckCircle,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Menunggu Verifikasi',
      value: stats.menungguVerifikasi,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Ringkasan data penerimaan peserta didik baru</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              {loadingData ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Memuat...
                </span>
              ) : (
                <span>Update terakhir: {new Date().toLocaleTimeString('id-ID')}</span>
              )}
            </div>
            <button
              onClick={loadDashboardData}
              disabled={loadingData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <TrendingUp className={`h-4 w-4 mr-2 ${loadingData ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon
          
          return (
            <div 
              key={card.title} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.textColor} transition-all duration-500`}>
                    {loadingData ? (
                      <div className="animate-pulse bg-gray-200 h-9 w-16 rounded"></div>
                    ) : (
                      <span className="animate-fade-in">{card.value || 0}</span>
                    )}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor} transition-all duration-300 hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Data Pendaftar */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Data Pendaftar</h3>
              <p className="text-sm text-gray-600">Kelola dan verifikasi data pendaftar PPDB</p>
            </div>
          </div>
          <Link 
            href="/admin/pendaftar"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="h-4 w-4 mr-2" />
            Lihat Data Pendaftar
          </Link>
        </div>

        {/* Laporan */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Laporan</h3>
              <p className="text-sm text-gray-600">Generate dan analisis laporan pendaftaran</p>
            </div>
          </div>
          <Link 
            href="/admin/laporan"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            Buat Laporan
          </Link>
        </div>

        {/* Pengaturan */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center mb-4">
            <Calendar className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pengaturan</h3>
              <p className="text-sm text-gray-600">Konfigurasi sistem dan konten website</p>
            </div>
          </div>
          <Link 
            href="/admin/pengaturan"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Kelola Pengaturan
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terkini</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {loadingData ? (
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center text-sm animate-slide-in">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse-gentle"></div>
                  <span className="mr-2">{activity.icon}</span>
                  <span className="text-gray-600 flex-1">{activity.message}</span>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Status Sistem</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Status PPDB</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs animate-pulse-gentle">
                🟢 Online
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Pendaftar</span>
              <span className="font-semibold text-blue-600">{stats.totalPendaftar}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Pendaftar Hari Ini</span>
              <span className="font-semibold text-green-600">{stats.pendaftarBaru}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tingkat Kelengkapan</span>
              <span className="font-semibold text-purple-600">
                {stats.totalPendaftar > 0 ? Math.round((stats.dokumenLengkap / stats.totalPendaftar) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/admin/pendaftar" 
            className="group flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 border-2 border-blue-200 hover:border-blue-300"
          >
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-blue-700 font-medium">Kelola Pendaftar</span>
              <p className="text-xs text-blue-500 mt-1">{stats.totalPendaftar} total pendaftar</p>
            </div>
          </Link>
          
          <Link 
            href="/admin/verifikasi" 
            className="group flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-300 border-2 border-green-200 hover:border-green-300"
          >
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-green-700 font-medium">Verifikasi Dokumen</span>
              <p className="text-xs text-green-500 mt-1">{stats.menungguVerifikasi} menunggu</p>
            </div>
          </Link>
          
          <Link 
            href="/admin/laporan" 
            className="group flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-300 border-2 border-purple-200 hover:border-purple-300"
          >
            <div className="text-center">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-purple-700 font-medium">Download Laporan</span>
              <p className="text-xs text-purple-500 mt-1">Excel & PDF ready</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/pengumuman" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Kelola Pengumuman
        </Link>
        <Link href="/admin/jadwal" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Atur Jadwal
        </Link>
        <Link href="/admin/pengaturan" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Pengaturan
        </Link>
      </div>
    </div>
  )
}