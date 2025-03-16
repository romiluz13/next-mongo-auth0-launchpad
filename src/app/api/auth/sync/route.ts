import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { syncUserWithDatabase } from '@/features/user/lib/user-sync';
import { logger } from '@/lib/logger';

/**
 * API route to sync Auth0 user data with MongoDB
 * This is called after login to ensure user data is up-to-date
 */
export async function GET(req: NextRequest) {
  try {
    // Get Auth0 session
    const session = await getSession();
    
    if (!session?.user) {
      logger.warn('No authenticated user found during sync');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Sync user with database
    const user = await syncUserWithDatabase(session);
    
    if (!user) {
      logger.error('Failed to sync user with database');
      return NextResponse.json(
        { error: 'Failed to sync user data' },
        { status: 500 }
      );
    }

    // Return success response with sanitized user data
    return NextResponse.json({
      message: 'User synced successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    logger.error('Error in sync API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle POST requests for updating user data
 */
export async function POST(req: NextRequest) {
  try {
    // Get Auth0 session
    const session = await getSession();
    
    if (!session?.user) {
      logger.warn('No authenticated user found during data update');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    
    // Only allow updating specific fields
    const allowedFields = ['name', 'preferences'];
    const updateData: Record<string, any> = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    
    if (Object.keys(updateData).length === 0) {
      logger.warn('No valid fields to update');
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update user data
    const user = await syncUserWithDatabase(session);
    
    if (!user) {
      logger.error('Failed to sync user with database during update');
      return NextResponse.json(
        { error: 'Failed to update user data' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: 'User data updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    logger.error('Error in sync API route (POST):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 