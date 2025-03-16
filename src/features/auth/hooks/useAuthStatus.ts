'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';

export function useAuthStatus(requiredRole?: string) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(false);
  const [isTokenExpiring, setIsTokenExpiring] = useState<boolean>(false);

  useEffect(() => {
    // Handle authentication errors
    if (error) {
      logger.error('Auth error in useAuthStatus:', error);
      router.push('/api/auth/login');
      return;
    }

    // Check for role-based access if required
    if (user && requiredRole) {
      // Get user roles from the user object
      const roles = (user as any).roles || [];
      
      // Check if user has the required role
      const hasRole = roles.includes(requiredRole) || roles.includes('admin');
      setHasRequiredRole(hasRole);
      
      if (!hasRole) {
        logger.warn(`User lacks required role: ${requiredRole}`);
        router.push('/unauthorized');
      }
    } else if (user) {
      // No role required or user has the role
      setHasRequiredRole(true);
    }

    // Check token expiration
    if (user) {
      const tokenExpiresAt = (user as any)?.exp;
      if (tokenExpiresAt) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = tokenExpiresAt - currentTime;
        
        // If token expires in less than 5 minutes, mark as expiring
        if (timeUntilExpiry < 300) {
          logger.info('Token expiring soon');
          setIsTokenExpiring(true);
        } else {
          setIsTokenExpiring(false);
        }
      }
    }
  }, [user, isLoading, error, router, requiredRole]);

  const refreshToken = () => {
    if (isTokenExpiring && user) {
      logger.info('Refreshing token');
      
      // Get the current path to return to after refresh
      const returnTo = encodeURIComponent(window.location.pathname);
      
      // Redirect to refresh endpoint
      router.push(`/api/auth/refresh?returnTo=${returnTo}`);
    }
  };

  return {
    user,
    isLoading,
    error,
    hasRequiredRole,
    isTokenExpiring,
    refreshToken,
  };
} 