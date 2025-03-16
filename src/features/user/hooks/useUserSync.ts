'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { logger } from '@/lib/logger';

interface UserData {
  id: string;
  email: string;
  name: string;
  picture?: string;
  lastLogin?: Date;
}

export function useUserSync() {
  const { user, isLoading, error } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<Error | null>(null);

  useEffect(() => {
    // Only sync when we have a user and not already syncing
    if (user && !isLoading && !isSyncing && !syncError) {
      const syncUser = async () => {
        setIsSyncing(true);
        setSyncError(null);
        
        try {
          logger.info('Syncing user data with database');
          
          const response = await fetch('/api/auth/sync');
          
          if (!response.ok) {
            throw new Error(`Failed to sync user: ${response.statusText}`);
          }
          
          const data = await response.json();
          setUserData(data.user);
          logger.info('User data synced successfully');
        } catch (error) {
          logger.error('Error syncing user data:', error);
          setSyncError(error instanceof Error ? error : new Error('Unknown error during user sync'));
        } finally {
          setIsSyncing(false);
        }
      };
      
      syncUser();
    }
  }, [user, isLoading]);

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) {
      logger.warn('Cannot update user data: No authenticated user');
      return null;
    }
    
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update user data: ${response.statusText}`);
      }
      
      const result = await response.json();
      setUserData(result.user);
      logger.info('User data updated successfully');
      return result.user;
    } catch (error) {
      logger.error('Error updating user data:', error);
      setSyncError(error instanceof Error ? error : new Error('Unknown error during user update'));
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    userData,
    isSyncing,
    syncError,
    updateUserData,
  };
} 