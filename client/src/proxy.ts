import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('safeclick-session')?.value;
  const role = request.cookies.get('safeclick-role')?.value;
  const { pathname } = request.nextUrl;

  console.log(`[PROXY CHECK] Path: ${pathname} | Session Cookie: ${session || 'NOT FOUND'} | Role: ${role || 'NOT FOUND'}`);

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (session && (role === 'admin' || role === 'super_admin')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    if (!session || (role !== 'admin' && role !== 'super_admin')) {
      const adminLoginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(adminLoginUrl);
    }
    
    // Redirect /admin to /admin/dashboard for authorized admins
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

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
    // TEMPORARILY DISABLED: Allow access without login
    // const loginUrl = new URL('/login', request.url);
    // return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated requests away from login/signup/otp to dashboard
  if (isAuth && session) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirect root path depending on active session state
  if (pathname === '/') {
    if (session) {
      if (role === 'admin' || role === 'super_admin') {
         return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      // TEMPORARILY DISABLED: Allow access without login
      return NextResponse.redirect(new URL('/dashboard', request.url));
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
