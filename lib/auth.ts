'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface AdminUser {
  id: string
  username: string
  role: string
  createdAt: Date
  updatedAt: Date
}

// ================================
// ADMIN AUTHENTICATION ACTIONS
// ================================

export async function loginAction(formData: FormData): Promise<void> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/admin/dashboard'

  if (!username || !password) redirect('/admin/login?error=missing-credentials')

  // Check hardcoded admin first (fallback)
  if (username === 'admin' && password === 'admin123') {
    const sessionToken = await bcrypt.hash(`admin-${Date.now()}`, 10)
    const cookieStore = await cookies()
    cookieStore.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 jam
      path: '/',
    })
    redirect(redirectTo)
    return
  }

  // Try database admin
  try {
    const admin = await prisma.admin.findUnique({ where: { username } })
    if (!admin) redirect('/admin/login?error=invalid-credentials')

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash)
    if (!isPasswordValid) redirect('/admin/login?error=invalid-credentials')

    const sessionToken = await bcrypt.hash(`${admin.id}-${Date.now()}`, 10)
    const cookieStore = await cookies()
    cookieStore.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
      path: '/',
    })

    redirect(redirectTo)
  } catch (error) {
    console.error('Login error:', error)
    redirect('/admin/login?error=server-error')
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
  redirect('/admin/login')
}

// ================================
// ADMIN SESSION UTILITY
// ================================

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const sessionData = cookieStore.get('admin-session')?.value
  if (!sessionData) return null

  // Return hardcoded admin for fallback
  return {
    id: 'admin-1',
    username: 'admin',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

