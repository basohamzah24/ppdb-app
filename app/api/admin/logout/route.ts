import { NextRequest, NextResponse } from 'next/server'
import { AdminAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('Admin logout request received')
    
    // Get session token from cookies
    const adminSession = request.cookies.get('admin-session')
    const sessionToken = adminSession?.value

    // Create response with success message
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Logout berhasil',
        redirectTo: '/' 
      },
      { status: 200 }
    )
    
    // Clear admin session cookie completely
    response.cookies.set('admin-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0), // Set to past date to delete
      maxAge: 0
    })

    // Try to delete session from database if available
    if (sessionToken) {
      try {
        await AdminAuth.logoutAdmin(sessionToken)
        console.log('Database session deleted')
      } catch (dbError) {
        console.log('Database logout failed (OK for testing):', dbError)
      }
    }

    console.log('Admin logout completed, cookie cleared')
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    
    // Even if there's an error, still clear the cookie
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Logout berhasil',
        redirectTo: '/' 
      },
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