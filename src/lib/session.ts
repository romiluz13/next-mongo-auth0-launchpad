/**
 * Session Management Utility
 * 
 * This module provides utilities for managing user sessions beyond what Auth0 provides.
 * It includes functions for tracking user activity and managing session data.
 */

import { getSession, updateSession, getAccessToken } from '@auth0/nextjs-auth0';
import { cookies } from 'next/headers';
import { logger } from './logger';
import connectDB from './mongodb';
import User from './mongodb/models/User';

// Session tracking cookie name
const SESSION_COOKIE_NAME = 'mongodb-session-activity';
// Session activity update interval (5 minutes)
const SESSION_UPDATE_INTERVAL = 5 * 60 * 1000;

/**
 * Track user activity
 * 
 * This function updates the user's last activity timestamp
 */
export async function trackUserActivity(): Promise<void> {
  try {
    const session = await getSession();
    
    // If no session, skip tracking
    if (!session?.user) {
      return;
    }
    
    // Get the current time
    const currentTime = Date.now();
    
    // Get the last activity time from cookie
    const cookieStore = cookies();
    const lastActivityStr = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : 0;
    
    // If it's been less than the update interval, skip the update
    if (currentTime - lastActivity < SESSION_UPDATE_INTERVAL) {
      return;
    }
    
    // Update the activity cookie
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: currentTime.toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    // Update the database record
    await connectDB();
    
    // Find the user by email
    const user = await User.findByEmail(session.user.email);
    
    if (user) {
      // Update the last login time
      user.lastLogin = new Date();
      await user.save();
      
      logger.debug('Updated user activity:', session.user.email);
    }
  } catch (error) {
    logger.error('Error tracking user activity:', error);
  }
}

/**
 * Get user permissions
 * 
 * This function retrieves all permissions for the current user
 */
export async function getUserPermissions(): Promise<string[]> {
  try {
    const session = await getSession();
    
    // If no session, return empty permissions
    if (!session?.user) {
      return [];
    }
    
    // Get user from database to check role
    await connectDB();
    const user = await User.findByEmail(session.user.email);
    
    // Define permissions based on role
    const basePermissions = ['read:profile', 'update:profile'];
    
    if (!user) {
      return basePermissions;
    }
    
    // Admin permissions
    if (user.role === 'admin') {
      return [
        ...basePermissions,
        'read:users',
        'create:users',
        'update:users',
        'delete:users',
        'read:settings',
        'update:settings'
      ];
    }
    
    return basePermissions;
  } catch (error) {
    logger.error('Error getting user permissions:', error);
    return [];
  }
}

/**
 * Refresh user data
 * 
 * This function refreshes user data from Auth0
 */
export async function refreshUserData(): Promise<boolean> {
  try {
    // Get current session
    const session = await getSession();
    
    if (!session?.user) {
      return false;
    }
    
    // Get fresh data from Auth0
    const tokenSet = await getAccessToken();
    
    // Update the session with new data
    await updateSession(session);
    
    // Update the user record in database
    await connectDB();
    
    // Find or create the user
    const userData = {
      auth0Id: session.user.sub as string,
      email: session.user.email as string,
      name: session.user.name || (session.user.email as string),
      picture: session.user.picture,
      lastLogin: new Date()
    };
    
    await User.createOrUpdateUser(userData);
    
    return true;
  } catch (error) {
    logger.error('Error refreshing user data:', error);
    return false;
  }
} 