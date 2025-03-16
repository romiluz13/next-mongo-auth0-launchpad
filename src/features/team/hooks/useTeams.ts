'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { logger } from '@/lib/logger';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export function useTeams() {
  const { user, isLoading: isUserLoading } = useUser();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeams = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info('Fetching teams');
      
      const response = await fetch('/api/team');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch teams: ${response.statusText}`);
      }
      
      const result = await response.json();
      setTeams(result.data);
      logger.info('Teams fetched successfully');
    } catch (error) {
      logger.error('Error fetching teams:', error);
      setError(error instanceof Error ? error : new Error('Unknown error fetching teams'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch when we have a user
    if (user && !isUserLoading) {
      fetchTeams();
    }
  }, [user, isUserLoading]);

  const createTeam = async (name: string, description: string = '') => {
    if (!user) {
      logger.warn('Cannot create team: No authenticated user');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info('Creating team');
      
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create team: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Update teams list
      setTeams(prevTeams => [...prevTeams, result.data]);
      
      logger.info('Team created successfully');
      return result.data;
    } catch (error) {
      logger.error('Error creating team:', error);
      setError(error instanceof Error ? error : new Error('Unknown error creating team'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    teams,
    isLoading: isLoading || isUserLoading,
    error,
    fetchTeams,
    createTeam,
  };
} 