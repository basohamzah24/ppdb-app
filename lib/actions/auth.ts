
'use server'

import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface AdminUser {
  id: string
  username: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export async function loginAction(formData: FormData): Promise<void> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/admin/dashboard'

  if (!username || !password) redirect('/admin/login?error=missing-credentials')

  // Try database admin first
  try {
    const admin = await prisma.admin.findUnique({ where: { username } })
    
    // Check if admin exists and password matches (simple comparison for now)
    if (admin && admin.password === password) {
      const cookieStore = await cookies()
      cookieStore.set('admin-session', 'admin-authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      })
      redirect(redirectTo)
      return
    }
    
    // Fallback to hardcoded admin
    if (username === 'admin' && password === 'admin123') {
      const cookieStore = await cookies()
      cookieStore.set('admin-session', 'admin-authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      })
      redirect(redirectTo)
      return
    }

    redirect('/admin/login?error=invalid-credentials')
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

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const sessionData = cookieStore.get('admin-session')?.value
  if (!sessionData || sessionData !== 'admin-authenticated') return null

  // Try to get admin from database
  try {
    const admin = await prisma.admin.findFirst({ where: { username: 'admin' } })
    if (admin) {
      // return {
      //   id: admin.id,
      //   username: admin.username,
      //   role: admin.role,
      //   updatedAt: admin.updatedAt,
      // }
        return {
    id: admin.id,
    username: admin.username,
    role: admin.role,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  }

    }
  } catch (error) {
    console.error('Error getting admin from database:', error)
  }

  // Fallback to hardcoded admin
  return {
    id: 'admin-1',
    username: 'admin',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Utility functions for examples
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export async function loginAdmin(username: string, password: string): Promise<AdminUser | null> {
  // Check hardcoded admin
  if (username === 'admin' && password === 'admin123') {
    return {
      id: 'admin-1',
      username: 'admin',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  // Try database admin
  try {
    const admin = await prisma.admin.findUnique({ where: { username } })
    if (!admin) return null

    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) return null

    return {
      id: admin.id,
      username: admin.username,
      role: admin.role || 'admin',
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    }
  } catch (error) {
    console.error('Login admin error:', error)
    return null
  }
}

export async function createSessionData(admin: AdminUser): Promise<string> {
  // Simple session data creation (could be enhanced with JWT)
  return JSON.stringify({
    id: admin.id,
    username: admin.username,
    role: admin.role,
    timestamp: Date.now()
  })
}

