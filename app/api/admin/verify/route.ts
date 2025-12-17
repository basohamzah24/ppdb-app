import { NextRequest, NextResponse } from 'next/server'
import { AdminAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const adminSession = request.cookies.get('admin-session')
    const sessionToken = adminSession?.value

    if (!sessionToken) {
      return NextResponse.json(
        { message: 'No session token', isValid: false },
        { status: 401 }
      )
    }

    // Verify session token
    const admin = await AdminAuth.verifySession(sessionToken)

    return NextResponse.json(
      { 
        message: 'Session valid',
        isValid: true,
        admin: {
          id: admin.id,
          username: admin.username,
          nama: admin.nama,
          email: admin.email,
          role: admin.role
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Session verification error:', error)
    
    // Invalid session, clear cookie
    const response = NextResponse.json(
      { 
        message: 'Session tidak valid',
        isValid: false
      },
      { status: 401 }
    )
    
    response.cookies.delete('admin-session')
    return response
  }
}

// Method lain tidak diizinkan
export async function POST() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}