import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const adminSession = request.cookies.get('admin-session')
  const sessionToken = adminSession?.value
  
  console.log(`Middleware: ${pathname}, hasSession: ${!!sessionToken}`)
  
  // Handle admin routes (kecuali login) - perlu autentikasi
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!sessionToken) {
      console.log(`Redirecting to login: ${pathname}`)
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    console.log(`Admin access allowed: ${pathname}`)
  }
  
  // Handle redirect dari /admin root ke dashboard
  if (pathname === '/admin' || pathname === '/admin/') {
    if (sessionToken) {
      const dashboardUrl = new URL('/admin/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    } else {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Handle redirect dari /login lama ke /admin/login
  if (pathname === '/login') {
    const adminLoginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(adminLoginUrl)
  }
  
  // Handle admin login page - jika sudah login redirect ke dashboard
  if (pathname === '/admin/login') {
    if (sessionToken) {
      console.log('Already logged in, redirecting to dashboard')
      const dashboardUrl = new URL('/admin/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}