'use client'

import { useEffect, useState } from 'react'
import { 
  Users, 
  FileText, 
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react'

interface DashboardStats {
  totalPendaftar: number
  pendaftarBaru: number
  dokumenLengkap: number
  menungguVerifikasi: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPendaftar: 0,
    pendaftarBaru: 0,
    dokumenLengkap: 0,
    menungguVerifikasi: 0
  })
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoadingData(true)
      console.log('Loading dashboard data...')
      
      const response = await fetch('/api/admin/dashboard')
      const result = await response.json()
      
      if (response.ok && result.stats) {
        setStats(result.stats)
      } else {
        console.error('Failed to load dashboard data:', result)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang di panel administrasi PPDB</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          
          return (
            <div key={card.title} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {loadingData ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      card.value.toLocaleString()
                    )}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
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
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">5 pendaftar baru hari ini</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">3 dokumen menunggu verifikasi</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-gray-600">2 pengumuman aktif</span>
            </div>
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
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Aktif
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Terhubung
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Backup Terakhir</span>
              <span className="text-gray-500">2 jam lalu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Lihat Semua Pendaftar
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Verifikasi Dokumen
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Buat Pengumuman
        </button>
      </div>
    </div>
  )
}