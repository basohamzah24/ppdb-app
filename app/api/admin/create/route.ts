import { NextRequest, NextResponse } from 'next/server'
import { AdminAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, nama, email, role } = body

    // Validasi input
    if (!username || !password || !nama) {
      return NextResponse.json(
        { message: 'Username, password, dan nama wajib diisi' },
        { status: 400 }
      )
    }

    // Create admin
    const admin = await AdminAuth.createAdmin({
      username,
      password,
      nama,
      email,
      role: role || 'admin'
    })

    return NextResponse.json(
      {
        message: 'Admin berhasil dibuat',
        admin: {
          id: admin.id,
          username: admin.username,
          nama: admin.nama,
          email: admin.email,
          role: admin.role
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Create admin error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { message: 'Username sudah digunakan' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    )
  }
}

// Method lain tidak diizinkan  
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}