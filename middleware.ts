import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLogin = request.nextUrl.pathname.startsWith('/login');
  const hasSession = Boolean(request.cookies.get('clearpane_session')?.value);
  if (!hasSession && !isLogin) return NextResponse.redirect(new URL('/login', request.url));
  if (hasSession && isLogin) return NextResponse.redirect(new URL('/dashboard', request.url));
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
