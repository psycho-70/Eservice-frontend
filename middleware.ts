import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;

  // If no token and accessing admin routes → redirect to /signin
  if (!token && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Allow access
  return NextResponse.next();
}

// Apply middleware only to /admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
