import { getSession } from '@auth0/nextjs-auth0';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Team } from '@/lib/models/Team';
import { ApiKey } from '@/lib/models/ApiKey';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

/**
 * GET /api/dashboard
 * Returns dashboard data for the current user
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

    // Get user data
    const user = await User.findOne({ auth0Id: session.user.sub });
    
    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    // Get teams where user is a member
    const teams = await Team.find({ members: session.user.sub });

    // Get API keys for the user
    const apiKeys = await ApiKey.find({ userId: session.user.sub })
      .select('-key') // Don't return the actual key for security
      .sort({ createdAt: -1 });

    // Count active API keys
    const activeApiKeys = apiKeys.filter(key => {
      if (!key.expiresAt) return true;
      return new Date(key.expiresAt) > new Date();
    }).length;

    // Return dashboard data
    return createSuccessResponse({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        createdAt: user.createdAt,
      },
      stats: {
        teamCount: teams.length,
        apiKeyCount: apiKeys.length,
        activeApiKeys,
      },
      recentActivity: {
        // This would be populated from an activity log in a real app
        // For now, we'll return empty
        items: [],
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
} 