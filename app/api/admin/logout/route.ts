import { NextRequest, NextResponse } from 'next/server'
import { AdminAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookies
    const adminSession = request.cookies.get('admin-session')
    const sessionToken = adminSession?.value

    if (sessionToken) {
      // Delete session from database
      await AdminAuth.logoutAdmin(sessionToken)
    }

    // Clear admin session cookie
    const response = NextResponse.json(
      { message: 'Logout berhasil' },
      { status: 200 }
    )
    
    response.cookies.delete('admin-session')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    
    // Even if there's an error, still clear the cookie
    const response = NextResponse.json(
      { message: 'Logout berhasil' },
      { status: 200 }
    )
    
    response.cookies.delete('admin-session')
    return response
  }
}

// Method lain tidak diizinkan
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}