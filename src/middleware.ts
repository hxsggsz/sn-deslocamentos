import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest, res: NextResponse) {
  const userCookie = req.cookies.get('token')

  if (!userCookie) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (req.nextUrl.pathname === '/' && userCookie) {
    return NextResponse.redirect(new URL('/deslocamento', req.url))
  }
}

export const config = {
  matcher: ['/', '/deslocamento'],
}
