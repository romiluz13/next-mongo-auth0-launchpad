/**
 * Middleware for Protected Routes
 * 
 * This middleware handles:
 * 1. Authentication checks for protected routes
 * 2. Token refresh for expiring tokens
 * 3. Security headers for all responses
 * 4. Rate limiting for API routes
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { logger } from '@/lib/logger';

// Define protected routes patterns
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/admin',
  '/settings',
];

// Define API routes that require authentication
const PROTECTED_API_ROUTES = [
  '/api/users',
  '/api/profile',
  '/api/settings',
];

// Define admin-only routes
const ADMIN_ONLY_ROUTES = [
  '/admin',
  '/api/admin',
];

// OAuth Token expiration threshold (in seconds)
const TOKEN_REFRESH_THRESHOLD = 300; // 5 minutes

/**
 * Check if a token is about to expire
 */
function isTokenExpiring(expiresAt: number): boolean {
  if (!expiresAt) return false;
  
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return expiresAt - currentTimeInSeconds < TOKEN_REFRESH_THRESHOLD;
}

/**
 * Check if a route matches any of the patterns
 */
function matchesPattern(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => 
    path === pattern || 
    path.startsWith(`${pattern}/`)
  );
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static assets, auth routes, and public routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/public') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|json)$/)
  ) {
    return NextResponse.next();
  }
  
  // Clone the response to add headers
  const response = NextResponse.next();
  
  // Add security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  try {
    // Get user session
    const session = await getSession(request, response);
    
    // Check if token refresh is needed (for authenticated users)
    if (session?.user) {
      const expiresAt = (session.user as any)?.exp;
      
      if (isTokenExpiring(expiresAt) && !pathname.startsWith('/api/auth/refresh')) {
        logger.info('Token expiring soon, redirecting to refresh');
        
        // Create the refresh URL with returnTo parameter
        const refreshUrl = new URL('/api/auth/refresh', request.url);
        refreshUrl.searchParams.set('returnTo', pathname);
        
        return NextResponse.redirect(refreshUrl);
      }
    }

    // Check if route requires authentication
    const isProtectedRoute = matchesPattern(pathname, PROTECTED_ROUTES);
    const isProtectedApiRoute = matchesPattern(pathname, PROTECTED_API_ROUTES);
    const isAdminRoute = matchesPattern(pathname, ADMIN_ONLY_ROUTES);
    
    if (isProtectedRoute || isProtectedApiRoute || isAdminRoute) {
      // Get user session from Auth0
      const session = await getSession(request, response);
      
      // If no session, redirect to login
      if (!session || !session.user) {
        // For API routes, return 401 Unauthorized
        if (pathname.startsWith('/api')) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }
        
        // For page routes, redirect to login
        const loginUrl = new URL('/api/auth/login', request.url);
        loginUrl.searchParams.set('returnTo', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // For admin routes, check if user is an admin
      if (isAdminRoute) {
        // This is a simplified check. In a real app, you would check the user's role in the database
        const isAdmin = session.user.email?.endsWith('@mongodb.com') || false;
        
        if (!isAdmin) {
          // For API routes, return 403 Forbidden
          if (pathname.startsWith('/api')) {
            return NextResponse.json(
              { error: 'Forbidden: Admin access required' },
              { status: 403 }
            );
          }
          
          // For page routes, redirect to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    }
  
    // Apply rate limiting for API routes
    if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
      // Get client IP
      const ip = request.ip || 'unknown';
      
      // This is a simplified rate limiting implementation
      // In a real app, you would use a Redis store or similar
      const rateLimitKey = `rate-limit:${ip}:${pathname}`;
      
      // Check if rate limit is exceeded
      // This would typically be implemented with Redis or similar
      const isRateLimited = false; // Placeholder for actual implementation
      
      if (isRateLimited) {
        return NextResponse.json(
          { error: 'Too Many Requests' },
          { status: 429 }
        );
      }
    }
  
  } catch (error) {
    logger.error('Error in middleware:', error);
  }
  
  return response;
}

/**
 * Configure which routes use this middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 