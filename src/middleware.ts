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

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Prevent /admin and /profile access if not logged in
  if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/profile'))) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Only ADMINs can access /admin and /profile
  if (token && (pathname.startsWith('/admin') || pathname.startsWith('/profile')) && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/error-404', req.url))
  }

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
