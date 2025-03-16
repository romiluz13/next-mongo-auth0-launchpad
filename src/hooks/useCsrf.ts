'use client';

/**
 * CSRF Token Hook
 * 
 * This hook provides functionality for retrieving and using CSRF tokens
 * to protect against Cross-Site Request Forgery attacks.
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

export function useCsrf() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch a new CSRF token
  const fetchToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/csrf');
      
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }
      
      const data = await response.json();
      setToken(data.token);
    } catch (err: any) {
      logger.error('Error fetching CSRF token:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch token on component mount
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Function to create fetch options with CSRF token
  const withCsrf = useCallback(
    (options: RequestInit = {}): RequestInit => {
      if (!token) {
        logger.warn('CSRF token not available');
        return options;
      }

      const headers = new Headers(options.headers || {});
      headers.set('x-csrf-token', token);

      return {
        ...options,
        headers,
      };
    },
    [token]
  );

  // Function to make an API request with CSRF protection
  const fetchWithCsrf = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!token) {
        await fetchToken();
      }

      const csrfOptions = withCsrf(options);
      
      try {
        const response = await fetch(url, csrfOptions);
        
        // If we get a 403 error, the token might be invalid or expired
        if (response.status === 403) {
          const data = await response.json();
          
          // If the error is related to CSRF, try to refresh the token
          if (data.error?.includes('CSRF')) {
            logger.warn('CSRF validation failed, refreshing token');
            await fetchToken();
            
            // Retry the request with the new token
            return fetch(url, withCsrf(options));
          }
        }
        
        return response;
      } catch (err) {
        logger.error('Error in fetchWithCsrf:', err);
        throw err;
      }
    },
    [token, fetchToken, withCsrf]
  );

  return {
    token,
    loading,
    error,
    fetchToken,
    withCsrf,
    fetchWithCsrf,
  };
} 