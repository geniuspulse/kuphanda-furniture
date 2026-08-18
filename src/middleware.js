import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'akonzi-admin-2026');

export async function middleware(request) {
  const token = request.cookies.get('akonzi_admin_token')?.value;
  if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));
  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};
