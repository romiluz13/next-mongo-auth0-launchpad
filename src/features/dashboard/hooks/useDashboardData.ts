'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { logger } from '@/lib/logger';

interface DashboardStats {
  teamCount: number;
  apiKeyCount: number;
  activeApiKeys: number;
}

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

interface DashboardData {
  user: DashboardUser;
  stats: DashboardStats;
  recentActivity: {
    items: ActivityItem[];
  };
}

export function useDashboardData() {
  const { user, isLoading: isUserLoading } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only fetch when we have a user
    if (user && !isUserLoading) {
      const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          logger.info('Fetching dashboard data');
          
          const response = await fetch('/api/dashboard');
          
          if (!response.ok) {
            throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
          }
          
          const result = await response.json();
          setData(result.data);
          logger.info('Dashboard data fetched successfully');
        } catch (error) {
          logger.error('Error fetching dashboard data:', error);
          setError(error instanceof Error ? error : new Error('Unknown error fetching dashboard data'));
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchDashboardData();
    }
  }, [user, isUserLoading]);

  return {
    data,
    isLoading: isLoading || isUserLoading,
    error,
  };
} 