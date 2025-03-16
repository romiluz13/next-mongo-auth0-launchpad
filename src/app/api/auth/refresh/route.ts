/**
 * Auth0 Token Refresh API Route
 * 
 * This route handler refreshes the user's Auth0 token when it's about to expire.
 */

import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { Session } from '@auth0/nextjs-auth0';
import { logger } from '@/lib/logger';

/**
 * GET /api/auth/refresh
 * 
 * Handles Auth0 token refresh
 */
export async function GET(req: NextRequest) {
  try {
    // Get the return URL from query params
    const { searchParams } = new URL(req.url);
    const returnTo = searchParams.get('returnTo') || '/';
    
    // Handle Auth0 refresh using the official SDK
    const handler = handleAuth({
      callback: handleCallback({
        afterCallback: (_req: any, _res: any, session: Session) => {
          logger.info('Token refreshed successfully');
          return session;
        },
      })
    });
    
    return handler(req as any);
  } catch (error) {
    logger.error('Error refreshing token:', error);
    
    // Redirect to login on error
    const { searchParams } = new URL(req.url);
    const returnPath = searchParams.get('returnTo') || '/';
    
    const loginUrl = new URL('/api/auth/login', req.nextUrl.origin);
    loginUrl.searchParams.set('returnTo', returnPath);
    
    return NextResponse.redirect(loginUrl);
  }
}

// Also handle POST requests
export const POST = handleAuth(); 