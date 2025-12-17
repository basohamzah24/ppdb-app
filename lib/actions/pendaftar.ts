'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getCurrentAdmin } from '@/lib/auth'

// Server Actions untuk Dashboard Statistics
export async function getDashboardStats() {
  try {
    const [
      totalPendaftar,
      menungguVerifikasi,
      diterima,
      ditolak,
      dokumenBelumLengkap
    ] = await Promise.all([
      prisma.pendaftar.count(),
      prisma.pendaftar.count({ where: { statusVerifikasi: 'pending' } }),
      prisma.pendaftar.count({ where: { statusKelulusan: 'diterima' } }),
      prisma.pendaftar.count({ where: { statusKelulusan: 'ditolak' } }),
      prisma.pendaftar.count({
        where: {
          dokumen: {
            none: {}
          }
        }
      })
    ])

    return {
      totalPendaftar,
      menungguVerifikasi,
      diterima,
      ditolak,
      dokumenBelumLengkap
    }
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    throw new Error('Gagal mengambil statistik dashboard')
  }
}

// Server Action untuk mendapatkan aktivitas terbaru
export async function getRecentActivities() {
  try {
    const activities = await prisma.logActivity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    })

    return activities
  } catch (error) {
    console.error('Error getting recent activities:', error)
    throw new Error('Gagal mengambil aktivitas terbaru')
  }
}

// Server Actions untuk Pendaftar
export async function getPendaftarList(
  search?: string,
  statusVerifikasi?: string,
  jenisKelamin?: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const where: {
      OR?: Array<{ namaLengkap?: { contains: string, mode: 'insensitive' } } | { nomorPendaftaran?: { contains: string, mode: 'insensitive' } } | { nik?: { contains: string, mode: 'insensitive' } }>
      statusVerifikasi?: string
      jenisKelamin?: string
    } = {}

    if (search) {
      where.OR = [
        { namaLengkap: { contains: search, mode: 'insensitive' } },
        { nomorPendaftaran: { contains: search, mode: 'insensitive' } },
        { nik: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (statusVerifikasi && statusVerifikasi !== 'all') {
      where.statusVerifikasi = statusVerifikasi
    }

    if (jenisKelamin && jenisKelamin !== 'all') {
      where.jenisKelamin = jenisKelamin
    }

    const skip = (page - 1) * limit

    const [pendaftar, total] = await Promise.all([
      prisma.pendaftar.findMany({
        where,
        include: {
          orangTua: true,
          dokumen: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.pendaftar.count({ where })
    ])

    return {
      pendaftar,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  } catch (error) {
    console.error('Error getting pendaftar list:', error)
    throw new Error('Gagal mengambil data pendaftar')
  }
}

export async function getPendaftarById(id: string) {
  try {
    const pendaftar = await prisma.pendaftar.findUnique({
      where: { id },
      include: {
        orangTua: true,
        dokumen: true
      }
    })

    if (!pendaftar) {
      throw new Error('Pendaftar tidak ditemukan')
    }

    return pendaftar
  } catch (error) {
    console.error('Error getting pendaftar by id:', error)
    throw new Error('Gagal mengambil data pendaftar')
  }
}

export async function updateStatusVerifikasi(
  id: string,
  status: 'pending' | 'verified' | 'rejected',
  catatan?: string
) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      throw new Error('Unauthorized')
    }

    const pendaftar = await prisma.pendaftar.update({
      where: { id },
      data: {
        statusVerifikasi: status,
        catatanVerifikasi: catatan,
        updatedAt: new Date()
      }
    })

    // Log activity
    await prisma.logActivity.create({
      data: {
        userId: admin.id,
        activity: 'UPDATE_VERIFICATION_STATUS',
        details: `Updated verification status for ${pendaftar.namaLengkap} to ${status}`
      }
    })

    revalidatePath('/admin/pendaftar')
    revalidatePath(`/admin/pendaftar/${id}`)
    
    return pendaftar
  } catch (error) {
    console.error('Error updating verification status:', error)
    throw new Error('Gagal mengupdate status verifikasi')
  }
}

export async function updateStatusKelulusan(
  id: string,
  status: 'pending' | 'diterima' | 'ditolak'
) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      throw new Error('Unauthorized')
    }

    const pendaftar = await prisma.pendaftar.update({
      where: { id },
      data: {
        statusKelulusan: status,
        updatedAt: new Date()
      }
    })

    // Log activity
    await prisma.logActivity.create({
      data: {
        userId: admin.id,
        activity: 'UPDATE_GRADUATION_STATUS',
        details: `Updated graduation status for ${pendaftar.namaLengkap} to ${status}`
      }
    })

    revalidatePath('/admin/pendaftar')
    revalidatePath(`/admin/pendaftar/${id}`)
    
    return pendaftar
  } catch (error) {
    console.error('Error updating graduation status:', error)
    throw new Error('Gagal mengupdate status kelulusan')
  }
}

