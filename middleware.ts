import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* — not /admin itself
  const isProtected = pathname.startsWith('/admin/') && pathname !== '/admin';

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check if token exists in cookies
  const token = request.cookies.get('token')?.value;

  // If no token, redirect to "/"
  if (!token) {
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Token exists, allow access
  return NextResponse.next();
}

// Only match paths under /admin/*
export const config = {
  matcher: ['/admin/:path*'],
};
