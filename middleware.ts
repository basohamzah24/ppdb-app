import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Hanya proteksi route admin
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin-session')
    const sessionToken = adminSession?.value

    // Route yang tidak perlu autentikasi
    const publicAdminRoutes = ['/admin/login']
    const isPublicRoute = publicAdminRoutes.includes(pathname)

    if (!isPublicRoute) {
      // Route yang perlu autentikasi - hanya cek keberadaan session token
      if (!sessionToken) {
        const loginUrl = new URL('/admin/login', request.url)
        return NextResponse.redirect(loginUrl)
      }
      // Full verification akan dilakukan di API routes atau server components
    } else {
      // Jika sudah ada session token dan akses halaman login, redirect ke dashboard
      if (sessionToken) {
        const dashboardUrl = new URL('/admin/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}