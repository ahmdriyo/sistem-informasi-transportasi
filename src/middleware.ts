import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const role = req.cookies.get('role')?.value
  const { pathname } = req.nextUrl

  // Allow public paths
  const publicPaths = ['/auth/login', '/auth/signup']

  // Allow static files & API routes
  const isPublicPath = publicPaths.includes(pathname)
  const isApiRoute = pathname.startsWith('/api')
  const isStatic = pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.includes('/images/') || pathname.includes('/icons/')

  // Cegah akses /admin dan /profile jika tidak login
  if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/profile'))) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Hanya ADMIN yang boleh akses /admin dan /profile
  if (token && (pathname.startsWith('/admin') || pathname.startsWith('/profile')) && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url)) // Redirect ke home atau halaman lain
  }

  // Boleh akses public, API, dan static
  if (isPublicPath || isApiRoute || isStatic) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons/|images/|public/|api/).*)',
  ],
}
