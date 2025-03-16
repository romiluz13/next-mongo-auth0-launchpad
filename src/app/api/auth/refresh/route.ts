import { handleAuth } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getSession } from '@auth0/nextjs-auth0';

/**
 * This endpoint handles token refreshing for Auth0
 * It redirects to the login endpoint with a returnTo parameter
 */
export async function GET(req: NextRequest) {
  try {
    logger.info('Token refresh requested');
    
    // Check if user is authenticated
    const session = await getSession();
    
    if (!session) {
      logger.warn('No session found during token refresh');
      return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }
    
    // Get the return URL
    const returnTo = req.nextUrl.searchParams.get('returnTo') || '/dashboard';
    
    // Redirect to login with returnTo parameter
    // Auth0 will handle the token refresh during the authentication flow
    const loginUrl = new URL('/api/auth/login', req.url);
    loginUrl.searchParams.set('returnTo', returnTo);
    
    logger.info(`Redirecting to Auth0 login for token refresh, will return to: ${returnTo}`);
    
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    logger.error('Error in refresh token route:', error);
    
    // Redirect to login on error
    return NextResponse.redirect(new URL('/api/auth/login', req.url));
  }
}

// Also handle POST requests
export const POST = handleAuth(); 