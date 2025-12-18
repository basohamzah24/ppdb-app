import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Ambil semua konten atau konten berdasarkan key
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key) {
      // Ambil konten berdasarkan key
      const content = await prisma.content.findUnique({
        where: { key }
      })
      
      if (!content) {
        return NextResponse.json(
          { success: false, message: 'Konten tidak ditemukan' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, data: content })
    } else {
      // Ambil semua konten aktif
      const contents = await prisma.content.findMany({
        where: { isActive: true },
        orderBy: { key: 'asc' }
      })

      return NextResponse.json({ success: true, data: contents })
    }
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil konten' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Update atau create konten
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, content, type = 'text' } = body

    if (!key || !content) {
      return NextResponse.json(
        { success: false, message: 'Key dan content harus diisi' },
        { status: 400 }
      )
    }

    // Upsert konten
    const result = await prisma.content.upsert({
      where: { key },
      update: {
        content,
        type,
        isActive: true
      },
      create: {
        key,
        content,
        type,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Konten berhasil disimpan'
    })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan konten' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}