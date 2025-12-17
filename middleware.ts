import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Hanya proteksi route admin, KECUALI halaman login
  if (pathname.startsWith('/admin') && pathname !== '/admin' && pathname !== '/admin/login') {
    const adminSession = request.cookies.get('admin-session')
    
    // Jika tidak ada session, redirect ke login
    if (!adminSession || adminSession.value !== 'admin-authenticated') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Jika sudah login dan akses halaman login, redirect ke dashboard
  if (pathname === '/admin' || pathname === '/admin/login') {
    const adminSession = request.cookies.get('admin-session')
    if (adminSession && adminSession.value === 'admin-authenticated') {
      const dashboardUrl = new URL('/admin/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}