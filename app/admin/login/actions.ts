'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    redirect('/admin/login?error=missing-credentials')
  }

  try {
    // Cek admin di database
    const admin = await prisma.admin.findUnique({ 
      where: { username } 
    })
    
    // Validasi kredensial (simple comparison untuk development)
    if (admin && admin.passwordHash === password) {
      // Set cookie session
      const cookieStore = await cookies()
      cookieStore.set('admin-session', 'admin-authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 jam
        path: '/',
      })
      
      // Redirect ke dashboard
      redirect('/admin/dashboard')
    }
    
    // Fallback ke hardcoded admin untuk development
    if (username === 'admin' && password === 'admin123') {
      const cookieStore = await cookies()
      cookieStore.set('admin-session', 'admin-authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60,
        path: '/',
      })
      
      redirect('/admin/dashboard')
    }
    
    // Kredensial salah
    redirect('/admin/login?error=invalid-credentials')
    
  } catch (error) {
    console.error('Login error:', error)
    redirect('/admin/login?error=server-error')
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
  redirect('/admin/login')
}