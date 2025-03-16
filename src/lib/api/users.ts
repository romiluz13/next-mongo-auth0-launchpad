/**
 * Users API Client
 * 
 * This module provides React Query hooks for user data fetching.
 * It includes proper error handling and type safety.
 */

import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { IUser } from '@/lib/mongodb/models/User';

// API response types
interface UsersResponse {
  users: Partial<IUser>[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface UserResponse {
  user: Partial<IUser>;
}

interface ErrorResponse {
  error: string;
}

// API client functions
async function fetchUsers(page = 1, limit = 10): Promise<UsersResponse> {
  const response = await fetch(`/api/users?page=${page}&limit=${limit}`);
  
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || 'Failed to fetch users');
  }
  
  return response.json();
}

async function fetchUser(id: string): Promise<UserResponse> {
  const response = await fetch(`/api/users/${id}`);
  
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || 'Failed to fetch user');
  }
  
  return response.json();
}

async function updateUser(id: string, data: Partial<IUser>): Promise<UserResponse> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || 'Failed to update user');
  }
  
  return response.json();
}

async function deleteUser(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || 'Failed to delete user');
  }
  
  return { success: true };
}

// React Query hooks
export function useUsers(page = 1, limit = 10) {
  return useQuery<UsersResponse, Error>({
    queryKey: ['users', page, limit],
    queryFn: () => fetchUsers(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

export function useUser(id: string) {
  return useQuery<UserResponse, Error>({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only run if id is provided
    retry: 1,
  });
}

interface UpdateUserVariables {
  id: string;
  data: Partial<IUser>;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation<UserResponse, Error, UpdateUserVariables>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (data: UserResponse, variables: UpdateUserVariables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
} 