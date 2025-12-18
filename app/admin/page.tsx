'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRoot() {
  const router = useRouter()

  const checkSessionAndRedirect = useCallback(async () => {
    try {
      // Cek cookie session langsung di client
      const hasCookie = document.cookie.includes('admin-session=')
      
      if (hasCookie) {
        console.log('Session found, redirecting to dashboard')
        router.push('/admin/dashboard')
      } else {
        console.log('No session found, redirecting to login')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Session check error:', error)
      router.push('/admin/login')
    }
  }, [router])

  useEffect(() => {
    // Cek session dan redirect yang sesuai
    checkSessionAndRedirect()
  }, [checkSessionAndRedirect])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-600">Mengalihkan...</span>
      </div>
    </div>
  )
}

