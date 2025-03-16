'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(false);

  useEffect(() => {
    // Handle authentication errors
    if (error) {
      logger.error('Auth error in ProtectedRoute:', error);
      router.push('/api/auth/login');
      return;
    }

    // Redirect if not authenticated
    if (!isLoading && !user) {
      logger.info('User not authenticated, redirecting to login');
      router.push('/api/auth/login');
      return;
    }

    // Check for role-based access if required
    if (user && requiredRole) {
      // Get user roles from the user object
      // This assumes your Auth0 token contains a 'roles' claim that is passed to the user object
      const roles = (user as any).roles || [];
      
      // Check if user has the required role
      const hasRole = roles.includes(requiredRole) || roles.includes('admin');
      setHasRequiredRole(hasRole);
      
      if (!hasRole) {
        logger.warn(`User lacks required role: ${requiredRole}`);
        router.push('/unauthorized');
      }
    } else {
      // No role required or user has the role
      setHasRequiredRole(true);
    }

    // Check token expiration
    const tokenExpiresAt = (user as any)?.exp;
    if (tokenExpiresAt) {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenExpiresAt - currentTime;
      
      // If token expires in less than 5 minutes, refresh it
      if (timeUntilExpiry < 300) {
        logger.info('Token expiring soon, redirecting to refresh');
        
        // Get the current path to return to after refresh
        const returnTo = encodeURIComponent(window.location.pathname);
        
        // Redirect to refresh endpoint
        router.push(`/api/auth/refresh?returnTo=${returnTo}`);
      }
    }
  }, [user, isLoading, error, router, requiredRole]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  // Show nothing while checking role
  if (!user || (requiredRole && !hasRequiredRole)) {
    return null;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
} 