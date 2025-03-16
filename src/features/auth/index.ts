// Export components
export { ProtectedRoute } from './components/ProtectedRoute';

// Export utilities
export {
  isTokenExpiringSoon,
  handleTokenRefresh,
  getUserRoles,
  hasRole,
  withRoleRequired,
} from './lib/auth-utils';

// Export hooks
export { useAuthStatus } from './hooks/useAuthStatus';

// Re-export Auth0 hooks for convenience
export {
  useUser,
  UserProvider,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0/client';

// Re-export types
export type { UserProfile } from '@auth0/nextjs-auth0/client'; 