import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is signed in and trying to access auth pages, redirect to dashboard
  if (session && (req.nextUrl.pathname.startsWith('/auth'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If the user is not signed in and trying to access protected routes, redirect to login
  const protectedPaths = ['/dashboard'];
  if (!session && protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 