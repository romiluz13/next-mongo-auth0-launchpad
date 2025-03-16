'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { logger } from '@/lib/logger';

interface ApiKey {
  _id: string;
  name: string;
  prefix: string;
  lastUsed: string | null;
  createdAt: string;
  expiresAt: string | null;
}

interface ApiKeyWithKey extends ApiKey {
  key: string;
}

export function useApiKeys() {
  const { user, isLoading: isUserLoading } = useUser();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApiKeys = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info('Fetching API keys');
      
      const response = await fetch('/api/keys');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch API keys: ${response.statusText}`);
      }
      
      const result = await response.json();
      setApiKeys(result.data);
      logger.info('API keys fetched successfully');
    } catch (error) {
      logger.error('Error fetching API keys:', error);
      setError(error instanceof Error ? error : new Error('Unknown error fetching API keys'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch when we have a user
    if (user && !isUserLoading) {
      fetchApiKeys();
    }
  }, [user, isUserLoading]);

  const createApiKey = async (name: string, expiresAt?: Date): Promise<ApiKeyWithKey | null> => {
    if (!user) {
      logger.warn('Cannot create API key: No authenticated user');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info('Creating API key');
      
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          expiresAt: expiresAt ? expiresAt.toISOString() : null 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create API key: ${response.statusText}`);
      }
      
      const result = await response.json();
      const newKey = result.data;
      
      // Update API keys list (without the actual key)
      const { key, ...keyWithoutSecret } = newKey;
      setApiKeys(prevKeys => [...prevKeys, keyWithoutSecret]);
      
      logger.info('API key created successfully');
      return newKey;
    } catch (error) {
      logger.error('Error creating API key:', error);
      setError(error instanceof Error ? error : new Error('Unknown error creating API key'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApiKey = async (keyId: string): Promise<boolean> => {
    if (!user) {
      logger.warn('Cannot delete API key: No authenticated user');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info(`Deleting API key: ${keyId}`);
      
      const response = await fetch(`/api/keys?id=${keyId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete API key: ${response.statusText}`);
      }
      
      // Update API keys list
      setApiKeys(prevKeys => prevKeys.filter(key => key._id !== keyId));
      
      logger.info('API key deleted successfully');
      return true;
    } catch (error) {
      logger.error('Error deleting API key:', error);
      setError(error instanceof Error ? error : new Error('Unknown error deleting API key'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    apiKeys,
    isLoading: isLoading || isUserLoading,
    error,
    fetchApiKeys,
    createApiKey,
    deleteApiKey,
  };
} 