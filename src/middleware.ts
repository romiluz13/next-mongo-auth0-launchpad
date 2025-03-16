import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { logger } from '@/lib/logger';

export async function middleware(request: NextRequest) {
  try {
    // Get the response
    const response = NextResponse.next();
    
    // Add security headers
    const headers = response.headers;

    // CORS
    headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || 'http://localhost:3000');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    headers.set('Access-Control-Allow-Credentials', 'true');

    // Security headers
    headers.set('X-DNS-Prefetch-Control', 'on');
    headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'origin-when-cross-origin');
    headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Content Security Policy
    headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' https:",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "base-uri 'self'",
        "object-src 'none'",
      ].join('; ')
    );

    // Check if the request is for a protected route
    const protectedRoutes = ['/dashboard', '/api/dashboard', '/api/user', '/api/team', '/api/keys'];
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (isProtectedRoute) {
      try {
        // Verify the session
        const session = await getSession(request, response);
        
        if (!session?.user) {
          // Redirect to login if no session
          return NextResponse.redirect(new URL('/api/auth/login', request.url));
        }
        
        // Add user info to headers for downstream use
        if (session.user.sub) {
          headers.set('X-User-ID', session.user.sub);
        }
      } catch (error) {
        logger.error('Auth error in middleware:', error);
        return NextResponse.redirect(new URL('/api/auth/login', request.url));
      }
    }

    return response;
  } catch (error) {
    logger.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Run middleware on all routes except static files and auth routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
}; 