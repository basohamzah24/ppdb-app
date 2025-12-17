import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Utility functions untuk auth admin
export class AdminAuth {
  
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  // Generate session token using Web Crypto API
  static generateSessionToken(): string {
    // Generate random bytes using Web Crypto API
    const array = new Uint8Array(32)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array)
    } else {
      // Fallback for environments without crypto
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Create admin account
  static async createAdmin(data: {
    username: string
    password: string
    nama: string
    email?: string
    role?: string
  }) {
    const hashedPassword = await this.hashPassword(data.password)
    
    return await prisma.admin.create({
      data: {
        username: data.username,
        password: hashedPassword,
        nama: data.nama,
        email: data.email,
        role: data.role || 'admin'
      }
    })
  }

  // Login admin
  static async loginAdmin(username: string, password: string) {
    // Find admin by username
    const admin = await prisma.admin.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        nama: true,
        email: true,
        role: true,
        isActive: true
      }
    })

    if (!admin || !admin.isActive) {
      throw new Error('Username atau password salah')
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, admin.password)
    if (!isPasswordValid) {
      throw new Error('Username atau password salah')
    }

    // Generate session token
    const token = this.generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 hari

    // Create session
    await prisma.adminSession.create({
      data: {
        adminId: admin.id,
        token,
        expiresAt
      }
    })

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    })

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        nama: admin.nama,
        email: admin.email,
        role: admin.role
      }
    }
  }

  // Verify session token
  static async verifySession(token: string) {
    const session = await prisma.adminSession.findUnique({
      where: { token },
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            nama: true,
            email: true,
            role: true,
            isActive: true
          }
        }
      }
    })

    if (!session || !session.admin.isActive) {
      throw new Error('Session tidak valid')
    }

    // Check if session expired
    if (session.expiresAt < new Date()) {
      // Delete expired session
      await prisma.adminSession.delete({
        where: { id: session.id }
      })
      throw new Error('Session sudah expired')
    }

    return session.admin
  }

  // Logout admin (delete session)
  static async logoutAdmin(token: string) {
    await prisma.adminSession.delete({
      where: { token }
    })
  }

  // Clean expired sessions
  static async cleanExpiredSessions() {
    await prisma.adminSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
  }

  // Get admin by ID
  static async getAdminById(id: string) {
    return await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nama: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      }
    })
  }
}

