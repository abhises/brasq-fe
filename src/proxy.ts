import { NextResponse, type NextRequest } from 'next/server';

/** Sends visitors without a session cookie to the admin login. brasq-be verifies the token on every API call. */
export function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === '/admin/login') return NextResponse.next();
  if (!req.cookies.get('bq_token')?.value) {
    const url = new URL('/admin/login', req.url);
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
