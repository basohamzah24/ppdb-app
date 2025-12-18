import { NextRequest, NextResponse } from 'next/server'
import { AdminAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log('Login attempt:', { username }) // Debug log

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Username dan password wajib diisi' 
        },
        { status: 400 }
      )
    }

    // Cek kredensial default untuk testing
    const validCredentials = [
      { username: 'admin', password: 'admin123' },
      { username: 'administrator', password: 'password123' }
    ]

    const validUser = validCredentials.find(
      cred => cred.username === username && cred.password === password
    )

    if (validUser) {
      const token = AdminAuth.generateSessionToken()
      
      const response = NextResponse.json(
        {
          success: true,
          message: 'Login berhasil',
          token: token,
          user: {
            username: validUser.username,
            nama: 'Administrator',
            role: 'admin'
          }
        },
        { status: 200 }
      )

      response.cookies.set('admin-session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      return response
    }

    // Jika bukan kredensial default, coba database
    try {
      const loginResult = await AdminAuth.loginAdmin(username, password)

      const response = NextResponse.json(
        {
          success: true,
          message: 'Login berhasil',
          token: loginResult.token,
          user: loginResult.admin
        },
        { status: 200 }
      )

      response.cookies.set('admin-session', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
      })

      return response

    } catch (dbError) {
      console.log('Database auth failed:', dbError)
      throw new Error('Username atau password salah')
    }

  } catch (error) {
    console.error('Login error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Username atau password salah' 
      },
      { status: 401 }
    )
  }
}

// Method lain tidak diizinkan
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}