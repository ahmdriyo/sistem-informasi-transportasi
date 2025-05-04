import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const role = 'admin'
  const { pathname } = req.nextUrl

  const allowedPaths = ['/auth/login', '/auth/signup']
  // const userValidationPath = '/auth/login/user-validation'

  // If no token and path is not allowed, redirect to login
  if (!token && !allowedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // If token exists
  if (token) {
    // Redirect to user validation if user is not verified
    if (!role) {
      return NextResponse.redirect(new URL(req.url))
    }
    // Redirect to home if user is verified and trying to access restricted paths
    // if (role) {
    //   return NextResponse.redirect(new URL('/admin/basic-tables', req.url))
    // }
  }

  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|icons/|images/|public/images/).*)',
}
