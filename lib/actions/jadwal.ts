'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getCurrentAdmin } from '@/lib/auth'

// Server Actions untuk Jadwal PPDB
export async function getJadwalList(
  search?: string,
  status?: string,
  tipe?: string
) {
  try {
    const where: {
      OR?: Array<{ namaKegiatan?: { contains: string, mode: 'insensitive' } } | { deskripsi?: { contains: string, mode: 'insensitive' } }>
      status?: string
      tipe?: string
    } = {}

    if (search) {
      where.OR = [
        { namaKegiatan: { contains: search, mode: 'insensitive' } },
        { deskripsi: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (tipe && tipe !== 'all') {
      where.tipe = tipe
    }

    const jadwal = await prisma.jadwalPPDB.findMany({
      where,
      orderBy: { tanggalMulai: 'asc' }
    })

    return jadwal
  } catch (error) {
    console.error('Error getting jadwal list:', error)
    throw new Error('Gagal mengambil data jadwal')
  }
}

export async function createJadwal(data: {
  namaKegiatan: string
  deskripsi: string
  tanggalMulai: string
  tanggalSelesai: string
  waktuMulai: string
  waktuSelesai: string
  tipe: string
  lokasi?: string
  catatan?: string
}) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      throw new Error('Unauthorized')
    }

    // Determine status based on dates
    const today = new Date()
    const startDate = new Date(data.tanggalMulai)
    const endDate = new Date(data.tanggalSelesai)
    
    let status: 'upcoming' | 'active' | 'completed' = 'upcoming'
    if (today >= startDate && today <= endDate) {
      status = 'active'
    } else if (today > endDate) {
      status = 'completed'
    }

    const jadwal = await prisma.jadwalPPDB.create({
      data: {
        ...data,
        tanggalMulai: new Date(data.tanggalMulai),
        tanggalSelesai: new Date(data.tanggalSelesai),
        status
      }
    })

    // Log activity
    await prisma.logActivity.create({
      data: {
        userId: admin.id,
        activity: 'CREATE_JADWAL',
        details: `Created new schedule: ${data.namaKegiatan}`
      }
    })

    revalidatePath('/admin/jadwal')
    
    return jadwal
  } catch (error) {
    console.error('Error creating jadwal:', error)
    throw new Error('Gagal membuat jadwal')
  }
}

export async function updateJadwal(id: string, data: {
  namaKegiatan: string
  deskripsi: string
  tanggalMulai: string
  tanggalSelesai: string
  waktuMulai: string
  waktuSelesai: string
  tipe: string
  lokasi?: string
  catatan?: string
}) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      throw new Error('Unauthorized')
    }

    // Determine status based on dates
    const today = new Date()
    const startDate = new Date(data.tanggalMulai)
    const endDate = new Date(data.tanggalSelesai)
    
    let status: 'upcoming' | 'active' | 'completed' = 'upcoming'
    if (today >= startDate && today <= endDate) {
      status = 'active'
    } else if (today > endDate) {
      status = 'completed'
    }

    const jadwal = await prisma.jadwalPPDB.update({
      where: { id },
      data: {
        ...data,
        tanggalMulai: new Date(data.tanggalMulai),
        tanggalSelesai: new Date(data.tanggalSelesai),
        status,
        updatedAt: new Date()
      }
    })

    // Log activity
    await prisma.logActivity.create({
      data: {
        userId: admin.id,
        activity: 'UPDATE_JADWAL',
        details: `Updated schedule: ${data.namaKegiatan}`
      }
    })

    revalidatePath('/admin/jadwal')
    
    return jadwal
  } catch (error) {
    console.error('Error updating jadwal:', error)
    throw new Error('Gagal mengupdate jadwal')
  }
}

export async function deleteJadwal(id: string) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      throw new Error('Unauthorized')
    }

    const jadwal = await prisma.jadwalPPDB.findUnique({
      where: { id }
    })

    if (!jadwal) {
      throw new Error('Jadwal tidak ditemukan')
    }

    await prisma.jadwalPPDB.delete({
      where: { id }
    })

    // Log activity
    await prisma.logActivity.create({
      data: {
        userId: admin.id,
        activity: 'DELETE_JADWAL',
        details: `Deleted schedule: ${jadwal.namaKegiatan}`
      }
    })

    revalidatePath('/admin/jadwal')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting jadwal:', error)
    throw new Error('Gagal menghapus jadwal')
  }
}

// Function untuk update status jadwal secara otomatis
export async function updateJadwalStatus() {
  try {
    const today = new Date()
    
    // Update jadwal yang seharusnya aktif
    await prisma.jadwalPPDB.updateMany({
      where: {
        tanggalMulai: { lte: today },
        tanggalSelesai: { gte: today },
        status: 'upcoming'
      },
      data: { status: 'active' }
    })

    // Update jadwal yang seharusnya selesai
    await prisma.jadwalPPDB.updateMany({
      where: {
        tanggalSelesai: { lt: today },
        status: { in: ['upcoming', 'active'] }
      },
      data: { status: 'completed' }
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating jadwal status:', error)
    throw new Error('Gagal mengupdate status jadwal')
  }
}

