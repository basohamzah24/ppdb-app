'use client'

import { useState } from 'react'
import { updateStatusVerifikasi } from '@/lib/actions/pendaftar'

interface StatusUpdateFormProps {
  pendaftarId: string
  currentStatus: string
  catatan: string
}

export function StatusUpdateForm({ pendaftarId, currentStatus, catatan }: StatusUpdateFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setMessage('')
    
    try {
      const status = formData.get('status') as 'pending' | 'verified' | 'rejected'
      const catatanNew = formData.get('catatan') as string
      
      await updateStatusVerifikasi(pendaftarId, status, catatanNew)
      setMessage('Status berhasil diperbarui')
      
      // Refresh halaman untuk menampilkan perubahan
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      setMessage('Terjadi kesalahan saat memperbarui status')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="text-md font-medium text-gray-900 mb-4">Update Status Verifikasi</h4>
      
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Verifikasi
          </label>
          <select
            name="status"
            defaultValue={currentStatus}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="pending">Menunggu Verifikasi</option>
            <option value="verified">Terverifikasi - Diterima</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catatan Verifikasi
          </label>
          <textarea
            name="catatan"
            defaultValue={catatan}
            rows={3}
            placeholder="Tambahkan catatan verifikasi (opsional)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            {message && (
              <p className={`text-sm ${
                message.includes('berhasil') ? 'text-green-600' : 'text-red-600'
              }`}>
                {message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Menyimpan...' : 'Update Status'}
          </button>
        </div>
      </form>
    </div>
  )
}

