'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function AdminJadwal() {
  return (
    <AdminLayout 
      title="Jadwal" 
      subtitle="Kelola jadwal kegiatan PPDB"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Jadwal PPDB
          </CardTitle>
          <CardDescription>
            Halaman ini sedang dalam pengembangan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Fitur Sedang Dikembangkan</h3>
            <p className="text-gray-500">Halaman jadwal akan segera tersedia</p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}