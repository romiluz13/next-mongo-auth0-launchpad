# Authentication with Auth0

This document outlines how authentication is implemented in the MongoDB Developer's Launch Pad template using Auth0.

## Setup

The template uses Auth0's Next.js SDK to handle authentication. The configuration is defined in environment variables:

```env
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_SCOPE='openid profile email offline_access'
AUTH0_AUDIENCE=your-api-audience
```

## Token Refresh Handling

The template implements automatic token refresh to ensure users remain authenticated without disruption.

### Key Components

1. **Token Expiration Detection**: Middleware checks token expiration and redirects to refresh endpoint when needed
2. **Refresh API Endpoint**: `/api/auth/refresh` handles token refresh via Auth0
3. **Session Management**: Server and client utilities for tracking sessions and refreshing tokens

### Implementation Details

#### Middleware Check

```typescript
// In middleware.ts
function isTokenExpiring(expiresAt: number): boolean {
  if (!expiresAt) return false;
  
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return expiresAt - currentTimeInSeconds < TOKEN_REFRESH_THRESHOLD;
}

// Check token expiration in middleware
const session = await getSession(request, response);
if (session?.user) {
  const expiresAt = (session.user as any)?.exp;
  
  if (isTokenExpiring(expiresAt)) {
    // Redirect to refresh endpoint
    const refreshUrl = new URL('/api/auth/refresh', request.url);
    refreshUrl.searchParams.set('returnTo', pathname);
    
    return NextResponse.redirect(refreshUrl);
  }
}
```

#### Refresh Endpoint

```typescript
// In src/app/api/auth/refresh/route.ts
export async function GET(req: NextRequest) {
  // Get the return URL
  const { searchParams } = new URL(req.url);
  const returnTo = searchParams.get('returnTo') || '/';
  
  // Handle Auth0 refresh using the SDK
  const handler = handleAuth({
    callback: handleCallback({
      afterCallback: (_req: any, _res: any, session: Session) => {
        logger.info('Token refreshed successfully');
        return session;
      },
    })
  });
  
  return handler(req as any);
}
```

## Session Management

The template extends Auth0 session management with additional utilities:

1. **Activity Tracking**: Tracks user activity to update last login timestamps
2. **Permissions Management**: Provides fine-grained access control based on user roles
3. **User Data Synchronization**: Keeps Auth0 user data in sync with the MongoDB database

### Key Session Functions

- `trackUserActivity()`: Updates user activity timestamps
- `getUserPermissions()`: Retrieves permissions based on user role
- `refreshUserData()`: Synchronizes user data between Auth0 and MongoDB

## Protected Routes

Routes can be protected at different levels:

1. **Middleware Protection**: Routes matching patterns in `PROTECTED_ROUTES` are automatically protected
2. **Component-Level Protection**: Using the `withPageAuthRequired` HOC or `useUser` hook
3. **API Route Protection**: Using session checks in API route handlers or middleware patterns

### Example Component-Level Protection

```tsx
'use client';

import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function DashboardPage() {
  const { user, error, isLoading } = useUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
    </div>
  );
}

export default withPageAuthRequired(DashboardPage);
```

## CSRF Protection

The template implements CSRF protection to prevent cross-site request forgery attacks:

1. **Token Generation**: Server generates encrypted tokens via `/api/csrf`
2. **Token Validation**: Server validates tokens on state-changing operations
3. **Client Integration**: `useCsrf` hook seamlessly integrates CSRF protection

### Usage in Forms

```tsx
'use client';

import { useState } from 'react';
import { useCsrf } from '@/hooks/useCsrf';

export default function ProfileForm() {
  const { fetchWithCsrf } = useCsrf();
  const [name, setName] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetchWithCsrf('/api/profile', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      // Success handling
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Update Profile</button>
    </form>
  );
}
``` 