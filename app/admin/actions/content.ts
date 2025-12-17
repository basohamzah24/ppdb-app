'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Validasi admin authentication
export async function requireAuth() {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin-session')
  
  if (!adminSession || adminSession.value !== 'admin-authenticated') {
    redirect('/admin/login')
  }
}

// Update konten site
export async function updateSiteContent(formData: FormData) {
  await requireAuth()
  
  const key = formData.get('key') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const type = formData.get('type') as string
  const isActive = formData.get('isActive') === 'true'
  
  if (!key || !title || !content || !type) {
    throw new Error('Semua field wajib diisi')
  }
  
  try {
    await prisma.siteContent.upsert({
      where: { key },
      update: {
        title,
        content,
        type,
        isActive,
      },
      create: {
        key,
        title,
        content,
        type,
        isActive,
      }
    })
    
    // Revalidate halaman publik agar perubahan langsung terlihat
    revalidatePath('/')
    revalidatePath('/admin/content')
    
    return { success: true, message: 'Konten berhasil diperbarui' }
  } catch (error) {
    console.error('Error updating content:', error)
    throw new Error('Gagal memperbarui konten')
  }
}

// Update pengaturan PPDB
export async function updatePPDBSettings(formData: FormData) {
  await requireAuth()
  
  const tahunAjaran = formData.get('tahunAjaran') as string
  const tanggalBuka = formData.get('tanggalBuka') as string
  const tanggalTutup = formData.get('tanggalTutup') as string
  const kuotaSiswa = parseInt(formData.get('kuotaSiswa') as string)
  const statusPendaftaran = formData.get('statusPendaftaran') as string
  const persyaratan = formData.get('persyaratan') as string
  const alurPendaftaran = formData.get('alurPendaftaran') as string
  const informasiTambahan = formData.get('informasiTambahan') as string
  
  if (!tahunAjaran || !tanggalBuka || !tanggalTutup || !kuotaSiswa) {
    throw new Error('Semua field wajib diisi')
  }
  
  try {
    // Parse persyaratan dan alur pendaftaran
    const persyaratanArray = persyaratan.split('\n').filter(item => item.trim())
    const alurArray = alurPendaftaran.split('\n').filter(item => item.trim())
    
    // Delete existing settings (karena hanya boleh ada 1)
    await prisma.pPDBSettings.deleteMany()
    
    // Create new settings
    await prisma.pPDBSettings.create({
      data: {
        tahunAjaran,
        tanggalBuka: new Date(tanggalBuka),
        tanggalTutup: new Date(tanggalTutup),
        kuotaSiswa,
        statusPendaftaran,
        persyaratan: persyaratanArray,
        alurPendaftaran: alurArray,
        informasiTambahan: informasiTambahan || null,
      }
    })
    
    // Revalidate halaman publik
    revalidatePath('/')
    revalidatePath('/admin/ppdb-settings')
    
    return { success: true, message: 'Pengaturan PPDB berhasil diperbarui' }
  } catch (error) {
    console.error('Error updating PPDB settings:', error)
    throw new Error('Gagal memperbarui pengaturan PPDB')
  }
}

// Get semua konten site
export async function getAllSiteContent() {
  try {
    return await prisma.siteContent.findMany({
      orderBy: { updatedAt: 'desc' }
    })
  } catch (error) {
    console.error('Error getting site content:', error)
    return []
  }
}

// Get pengaturan PPDB
export async function getPPDBSettings() {
  try {
    return await prisma.pPDBSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error getting PPDB settings:', error)
    return null
  }
}

// Get konten berdasarkan key (untuk halaman publik)
export async function getContentByKey(key: string) {
  try {
    return await prisma.siteContent.findUnique({
      where: { key, isActive: true }
    })
  } catch (error) {
    console.error('Error getting content by key:', error)
    return null
  }
}

// Get multiple content berdasarkan type
export async function getContentByType(type: string) {
  try {
    return await prisma.siteContent.findMany({
      where: { type, isActive: true },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error getting content by type:', error)
    return []
  }
}