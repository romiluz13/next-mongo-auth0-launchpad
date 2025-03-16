import { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserFromDatabase, updateUserData } from '@/features/user';
import { createErrorResponse, createSuccessResponse, handleApiError, validateRequestData } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

/**
 * GET /api/user
 * Returns the current user's data from the database
 */
export async function GET() {
  try {
    // Get Auth0 session
    const session = await getSession();
    
    if (!session?.user) {
      return createErrorResponse('Not authenticated', 401);
    }

    // Get user data from database
    const user = await getUserFromDatabase(session.user.sub);
    
    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    // Return user data
    return createSuccessResponse({
      id: user._id,
      auth0Id: user.auth0Id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/user
 * Updates the current user's data
 */
export async function PATCH(req: NextRequest) {
  try {
    // Get Auth0 session
    const session = await getSession();
    
    if (!session?.user) {
      return createErrorResponse('Not authenticated', 401);
    }

    // Parse request body
    const body = await req.json();
    
    // Validate request data
    const validation = validateRequestData(body, []);
    if (!validation.valid) {
      return createErrorResponse(validation.error, 400);
    }

    // Only allow updating specific fields
    const allowedFields = ['name', 'preferences'];
    const updateData: Record<string, any> = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    
    if (Object.keys(updateData).length === 0) {
      return createErrorResponse('No valid fields to update', 400);
    }

    // Update user data
    const user = await updateUserData(session.user.sub, updateData);
    
    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    // Return updated user data
    return createSuccessResponse({
      id: user._id,
      auth0Id: user.auth0Id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
} 