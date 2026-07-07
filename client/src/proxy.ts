import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('safeclick-session')?.value;
  const { pathname } = request.nextUrl;

  console.log(`[PROXY CHECK] Path: ${pathname} | Session Cookie: ${session || 'NOT FOUND'}`);

  // Paths that require authentication
  const protectedPaths = [
    '/dashboard',
    '/analyze',
    '/complaint',
    '/evidence',
    '/heatmap',
    '/learning',
    '/profile',
    '/settings',
    '/emergency',
    '/police-dashboard',
  ];

  // Paths that should not be visible when logged in
  const authPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/verify-otp',
  ];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuth = authPaths.some((path) => pathname.startsWith(path));

  // Redirect unauthenticated requests to login
  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated requests away from login/signup/otp to dashboard
  if (isAuth && session) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirect root path depending on active session state
  if (pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
