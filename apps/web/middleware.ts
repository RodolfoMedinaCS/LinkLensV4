import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Refresh the Supabase auth session on every request so that Server Components
 * never try to mutate cookies directly (which Next 15 forbids).
 * Returns a NextResponse object that already contains any updated cookies.
 */
async function updateSession(request: NextRequest) {
  // Create a draft response that we can add/overwrite cookies on.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Bind Supabase to the incoming request cookies and provide a way for it
  // to write refreshed cookies to BOTH the request (so subsequent reads in
  // this middleware are in-sync) and the outgoing response.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    },
  );

  // This will refresh the session if the refresh token is still valid.
  await supabase.auth.getUser();

  return { response, supabase };
}

export async function middleware(request: NextRequest) {
  // Always sync/refresh the session first.
  const { response, supabase } = await updateSession(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect authenticated users away from auth pages
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users trying to hit protected pages
  const protectedPaths = ['/dashboard'];
  if (!user && protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Otherwise continue with the (possibly cookie-patched) response.
  return response;
}

export const config = {
  matcher: [
    // Skip static files and images.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 