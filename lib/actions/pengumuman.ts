'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getCurrentAdmin } from '@/lib/auth'

// Server Actions untuk Pengumuman
export async function getPengumumanList(
  search?: string,
  status?: string,
  tipe?: string
) {
  try {
    const where: {
      OR?: Array<{ judul?: { contains: string, mode: 'insensitive' } } | { isi?: { contains: string, mode: 'insensitive' } }>
      status?: string
      tipe?: string
    } = {}

    if (search) {
      where.OR = [
        { judul: { contains: search, mode: 'insensitive' } },
        { isi: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (tipe && tipe !== 'all') {
      where.tipe = tipe
    }

    const pengumuman = await prisma.pengumuman.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return pengumuman
  } catch (error) {
    console.error('Error getting pengumuman list:', error)
    throw new Error('Gagal mengambil data pengumuman')
  }
}

export async function createPengumuman(data: {
  judul: string
  isi: string
  tipe: string
  isPinned: boolean
}) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      throw new Error('Unauthorized')
    }

    const pengumuman = await prisma.pengumuman.create({
      data: {
        ...data,
        author: `${admin.username} (Admin)`
      }
    })

    // Log activity
    await prisma.logActivity.create({
      data: {
        userId: admin.id,
        activity: 'CREATE_PENGUMUMAN',
        details: `Created new announcement: ${data.judul}`
      }
    })

    revalidatePath('/admin/pengumuman')
    
    return pengumuman
  } catch (error) {
    console.error('Error creating pengumuman:', error)
    throw new Error('Gagal membuat pengumuman')
  }
}

export async function updatePengumuman(id: string, data: {
  judul: string
  isi: string
  tipe: string
  isPinned: boolean
}) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      throw new Error('Unauthorized')
    }

    const pengumuman = await prisma.pengumuman.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })

    // Log activity
    await prisma.logActivity.create({
      data: {
        userId: admin.id,
        activity: 'UPDATE_PENGUMUMAN',
        details: `Updated announcement: ${data.judul}`
      }
    })

    revalidatePath('/admin/pengumuman')
    
    return pengumuman
  } catch (error) {
    console.error('Error updating pengumuman:', error)
    throw new Error('Gagal mengupdate pengumuman')
  }
}

export async function deletePengumuman(id: string) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      throw new Error('Unauthorized')
    }

    const pengumuman = await prisma.pengumuman.findUnique({
      where: { id }
    })

    if (!pengumuman) {
      throw new Error('Pengumuman tidak ditemukan')
    }

    await prisma.pengumuman.delete({
      where: { id }
    })

    // Log activity
    await prisma.logActivity.create({
      data: {
        userId: admin.id,
        activity: 'DELETE_PENGUMUMAN',
        details: `Deleted announcement: ${pengumuman.judul}`
      }
    })

    revalidatePath('/admin/pengumuman')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting pengumuman:', error)
    throw new Error('Gagal menghapus pengumuman')
  }
}

export async function publishPengumuman(id: string) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      throw new Error('Unauthorized')
    }

    const pengumuman = await prisma.pengumuman.update({
      where: { id },
      data: {
        status: 'published',
        tanggalPublish: new Date()
      }
    })

    // Log activity
    await prisma.logActivity.create({
      data: {
        userId: admin.id,
        activity: 'PUBLISH_PENGUMUMAN',
        details: `Published announcement: ${pengumuman.judul}`
      }
    })

    revalidatePath('/admin/pengumuman')
    
    return pengumuman
  } catch (error) {
    console.error('Error publishing pengumuman:', error)
    throw new Error('Gagal mempublikasi pengumuman')
  }
}

export async function unpublishPengumuman(id: string) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      throw new Error('Unauthorized')
    }

    const pengumuman = await prisma.pengumuman.update({
      where: { id },
      data: {
        status: 'draft',
        tanggalPublish: null
      }
    })

    // Log activity
    await prisma.logActivity.create({
      data: {
        userId: admin.id,
        activity: 'UNPUBLISH_PENGUMUMAN',
        details: `Unpublished announcement: ${pengumuman.judul}`
      }
    })

    revalidatePath('/admin/pengumuman')
    
    return pengumuman
  } catch (error) {
    console.error('Error unpublishing pengumuman:', error)
    throw new Error('Gagal membatalkan publikasi pengumuman')
  }
}

export async function togglePinPengumuman(id: string) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      throw new Error('Unauthorized')
    }

    const currentPengumuman = await prisma.pengumuman.findUnique({
      where: { id }
    })

    if (!currentPengumuman) {
      throw new Error('Pengumuman tidak ditemukan')
    }

    const pengumuman = await prisma.pengumuman.update({
      where: { id },
      data: {
        isPinned: !currentPengumuman.isPinned
      }
    })

    // Log activity
    await prisma.logActivity.create({
      data: {
        userId: admin.id,
        activity: pengumuman.isPinned ? 'PIN_PENGUMUMAN' : 'UNPIN_PENGUMUMAN',
        details: `${pengumuman.isPinned ? 'Pinned' : 'Unpinned'} announcement: ${pengumuman.judul}`
      }
    })

    revalidatePath('/admin/pengumuman')
    
    return pengumuman
  } catch (error) {
    console.error('Error toggling pin pengumuman:', error)
    throw new Error('Gagal mengubah status pin pengumuman')
  }
}

