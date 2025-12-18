'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Home,
  Users, 
  CheckCircle,
  Megaphone,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: Home,
      active: pathname === '/admin/dashboard'
    },
    { 
      name: 'Pendaftar', 
      href: '/admin/pendaftar', 
      icon: Users,
      active: pathname === '/admin/pendaftar'
    },
    { 
      name: 'Verifikasi', 
      href: '/admin/verifikasi', 
      icon: CheckCircle,
      active: pathname === '/admin/verifikasi'
    },
    { 
      name: 'Pengumuman', 
      href: '/admin/pengumuman', 
      icon: Megaphone,
      active: pathname === '/admin/pengumuman'
    },
    { 
      name: 'Jadwal', 
      href: '/admin/jadwal', 
      icon: Calendar,
      active: pathname === '/admin/jadwal'
    },
    { 
      name: 'Pengaturan', 
      href: '/admin/pengaturan', 
      icon: Settings,
      active: pathname === '/admin/pengaturan'
    }
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/login'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-30">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo dan Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PPDB</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Sistem PPDB Online</p>
              </div>
            </div>
          </div>

          {/* Header Right - Admin Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-700">Administrator</span>
              </div>
              <p className="text-xs text-gray-500">Admin@exampleAdmin.com</p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 z-20 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex justify-end p-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 pb-4 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href)
                      setSidebarOpen(false)
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200
                      ${item.active 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${item.active ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span>{item.name}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Footer info */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>PPDB Admin v1.0</p>
              <p>UPT SD Negeri 061 Sumpira</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 top-16 bg-black bg-opacity-25 z-10 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          {/* Page Header */}
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
          )}
          
          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  )
}