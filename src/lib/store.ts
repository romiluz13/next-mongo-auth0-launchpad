'use client';

/**
 * Client State Management with Zustand
 * 
 * This module provides a centralized store for client-side state management
 * using Zustand, which is a small, fast and scalable state management solution.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logger } from './logger';

// Define the app state interface
interface AppState {
  // UI state
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  
  // User preferences
  userPreferences: {
    dashboardLayout: 'grid' | 'list';
    codeTheme: string;
    fontSize: number;
    notifications: boolean;
  };
  
  // Application state
  lastViewedPage: string;
  lastRefreshed: Date | null;
  
  // Action count for optimistic updates
  actionCount: number;
  
  // UI state setters
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // User preferences setters
  setDashboardLayout: (layout: 'grid' | 'list') => void;
  setCodeTheme: (theme: string) => void;
  setFontSize: (size: number) => void;
  toggleNotifications: () => void;
  
  // Application state setters
  setLastViewedPage: (page: string) => void;
  refreshState: () => void;
  
  // Optimistic update helpers
  incrementActionCount: () => void;
  resetActionCount: () => void;
}

// Create the store with persist middleware
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // UI state with defaults
      theme: 'system',
      sidebarCollapsed: false,
      
      // User preferences with defaults
      userPreferences: {
        dashboardLayout: 'grid',
        codeTheme: 'github-dark',
        fontSize: 14,
        notifications: true,
      },
      
      // Application state
      lastViewedPage: '/',
      lastRefreshed: null,
      actionCount: 0,
      
      // UI state setters
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      // User preferences setters
      setDashboardLayout: (layout) => set((state) => ({
        userPreferences: { ...state.userPreferences, dashboardLayout: layout }
      })),
      setCodeTheme: (theme) => set((state) => ({
        userPreferences: { ...state.userPreferences, codeTheme: theme }
      })),
      setFontSize: (size) => set((state) => ({
        userPreferences: { ...state.userPreferences, fontSize: size }
      })),
      toggleNotifications: () => set((state) => ({
        userPreferences: { 
          ...state.userPreferences, 
          notifications: !state.userPreferences.notifications 
        }
      })),
      
      // Application state setters
      setLastViewedPage: (page) => set({ lastViewedPage: page }),
      refreshState: () => set({ lastRefreshed: new Date() }),
      
      // Optimistic update helpers
      incrementActionCount: () => set((state) => ({ actionCount: state.actionCount + 1 })),
      resetActionCount: () => set({ actionCount: 0 }),
    }),
    {
      name: 'mongodb-app-state',
      // Only persist these keys
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        userPreferences: state.userPreferences,
        lastViewedPage: state.lastViewedPage,
      }),
    }
  )
);

// Create specialized hooks for specific parts of the state
// This helps with performance by reducing re-renders

/**
 * Hook for theme-related state
 */
export function useTheme() {
  return useAppStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }));
}

/**
 * Hook for sidebar-related state
 */
export function useSidebar() {
  return useAppStore((state) => ({
    collapsed: state.sidebarCollapsed,
    toggleSidebar: state.toggleSidebar,
    setSidebarCollapsed: state.setSidebarCollapsed,
  }));
}

/**
 * Hook for user preferences
 */
export function useUserPreferences() {
  return useAppStore((state) => ({
    preferences: state.userPreferences,
    setDashboardLayout: state.setDashboardLayout,
    setCodeTheme: state.setCodeTheme,
    setFontSize: state.setFontSize,
    toggleNotifications: state.toggleNotifications,
  }));
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticUpdates() {
  return useAppStore((state) => ({
    actionCount: state.actionCount,
    incrementActionCount: state.incrementActionCount,
    resetActionCount: state.resetActionCount,
  }));
} 