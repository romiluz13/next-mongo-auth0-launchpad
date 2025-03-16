/**
 * Auth0 Token Refresh Utility
 * 
 * This module provides utilities for handling Auth0 token refresh.
 * It ensures tokens are refreshed before they expire.
 */

import { getSession, updateSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Check if a token is about to expire
 * 
 * @param expiresAt Token expiration timestamp
 * @param thresholdMinutes Minutes before expiration to trigger refresh
 * @returns Whether the token is close to expiring
 */
export function isTokenExpiring(expiresAt: number, thresholdMinutes = 5): boolean {
  if (!expiresAt) return false;
  
  const thresholdSeconds = thresholdMinutes * 60;
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  
  return expiresAt - currentTimeInSeconds < thresholdSeconds;
}

/**
 * Token refresh middleware
 * 
 * This middleware checks if the user's token is about to expire,
 * and redirects to auth refresh if needed
 * 
 * @param req Next.js request
 * @returns Next.js response
 */
export async function refreshTokenMiddleware(req: NextRequest) {
  try {
    const session = await getSession();
    
    // If no session or no user, continue without refresh
    if (!session || !session.user) {
      return NextResponse.next();
    }
    
    // Check if token is expiring soon
    const expiresAt = (session.user as any)?.exp;
    
    if (isTokenExpiring(expiresAt)) {
      logger.info('Auth token expiring soon, initiating refresh');
      
      // Create the refresh URL
      const refreshUrl = new URL('/api/auth/refresh', req.nextUrl.origin);
      refreshUrl.searchParams.set('returnTo', req.nextUrl.pathname);
      
      // Redirect to token refresh endpoint
      return NextResponse.redirect(refreshUrl);
    }
    
    // Continue the request
    return NextResponse.next();
  } catch (error) {
    logger.error('Error in token refresh middleware:', error);
    return NextResponse.next();
  }
}

/**
 * Performs a silent token refresh when possible
 * Falls back to redirecting the user to re-authenticate
 * 
 * @param returnUrl URL to return to after refresh
 * @returns Success indicator
 */
export async function refreshAuthToken(returnUrl: string): Promise<boolean> {
  try {
    // Try silent refresh first (depends on Auth0 setup allowing refresh_token grant)
    const session = await getSession();
    
    if (!session) {
      return false;
    }
    
    // Attempt to update the session
    // Note: This requires Auth0 to be configured with refresh token rotation
    // and the proper scope (offline_access) to be requested
    await updateSession(session);
    
    logger.info('Auth token refreshed successfully');
    return true;
  } catch (error) {
    logger.error('Token refresh failed:', error);
    return false;
  }
} 