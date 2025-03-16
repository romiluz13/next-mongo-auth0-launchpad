import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Checks if a token is about to expire (within the next 5 minutes)
 */
export function isTokenExpiringSoon(expiresAt: number): boolean {
  const fiveMinutesInSeconds = 5 * 60;
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return expiresAt - currentTimeInSeconds < fiveMinutesInSeconds;
}

/**
 * Handles token refresh if needed
 */
export async function handleTokenRefresh(req: NextRequest, res: NextResponse) {
  try {
    const session = await getSession(req, res);
    
    if (!session) {
      return false;
    }
    
    // Check if token is about to expire
    if (session.accessTokenExpiresAt && isTokenExpiringSoon(session.accessTokenExpiresAt)) {
      logger.info('Access token is expiring soon, refreshing...');
      
      // In Next.js App Router, we can't directly refresh tokens in middleware
      // Instead, we'll redirect to a refresh endpoint that will handle this
      // This is a simplified approach - in production, you might want a more seamless solution
      logger.info('Token refresh required - this should be handled by your refresh endpoint');
      
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error('Error checking token expiration:', error);
    return false;
  }
}

/**
 * Gets user roles from Auth0 token
 */
export function getUserRoles(session: any): string[] {
  if (!session || !session.user) {
    return [];
  }
  
  // Extract roles from the token claims
  // This assumes your Auth0 token contains a 'roles' claim
  const roles = session.user.roles || [];
  
  return roles;
}

/**
 * Checks if user has required role
 */
export function hasRole(session: any, requiredRole: string): boolean {
  const roles = getUserRoles(session);
  return roles.includes(requiredRole) || roles.includes('admin');
}

/**
 * Creates a middleware for role-based access control
 */
export function withRoleRequired(requiredRole: string) {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      const session = await getSession(req, res);
      
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      if (!hasRole(session, requiredRole)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      // Check if token needs refresh
      const needsRefresh = await handleTokenRefresh(req, res);
      if (needsRefresh) {
        // In a real implementation, you might want to handle this differently
        logger.info('Token refresh needed during role check');
      }
      
      return null; // Continue to the next middleware or handler
    } catch (error) {
      logger.error('Auth error:', error);
      return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
    }
  };
} 