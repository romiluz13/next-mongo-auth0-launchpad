import { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import connectDB from '@/lib/mongodb';
import { Team } from '@/lib/models/Team';
import { createErrorResponse, createSuccessResponse, handleApiError, validateRequestData } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

/**
 * GET /api/team
 * Returns the teams that the current user belongs to
 */
export async function GET() {
  try {
    // Get Auth0 session
    const session = await getSession();
    
    if (!session?.user) {
      return createErrorResponse('Not authenticated', 401);
    }

    // Connect to MongoDB
    await connectDB();

    // Find teams where the user is a member
    const teams = await Team.find({ members: session.user.sub });

    // Return teams
    return createSuccessResponse(teams);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/team
 * Creates a new team
 */
export async function POST(req: NextRequest) {
  try {
    // Get Auth0 session
    const session = await getSession();
    
    if (!session?.user) {
      return createErrorResponse('Not authenticated', 401);
    }

    // Parse request body
    const body = await req.json();
    
    // Validate request data
    const validation = validateRequestData(body, ['name']);
    if (!validation.valid) {
      return createErrorResponse(validation.error, 400);
    }

    // Connect to MongoDB
    await connectDB();

    // Create new team
    const team = new Team({
      name: body.name,
      description: body.description || '',
      owner: session.user.sub,
      members: [session.user.sub],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save team
    await team.save();
    logger.info(`Team created: ${team._id} by user ${session.user.sub}`);

    // Return created team
    return createSuccessResponse(team, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/team
 * Deletes a team
 */
export async function DELETE(req: NextRequest) {
  try {
    // Get Auth0 session
    const session = await getSession();
    
    if (!session?.user) {
      return createErrorResponse('Not authenticated', 401);
    }

    // Get team ID from URL
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('id');
    
    if (!teamId) {
      return createErrorResponse('Missing team ID', 400);
    }

    // Connect to MongoDB
    await connectDB();

    // Find team
    const team = await Team.findById(teamId);
    
    if (!team) {
      return createErrorResponse('Team not found', 404);
    }
    
    // Check if user is the owner
    if (team.owner !== session.user.sub) {
      return createErrorResponse('Not authorized to delete this team', 403);
    }

    // Delete team
    await Team.findByIdAndDelete(teamId);
    
    logger.info(`Team deleted: ${teamId} by user ${session.user.sub}`);

    // Return success
    return createSuccessResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
} 