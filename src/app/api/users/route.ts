/**
 * Users API Routes
 * 
 * This module provides API endpoints for user management.
 * It includes proper error handling and authentication checks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import connectDB, { handleMongoDBError } from '@/lib/mongodb';
import User from '@/lib/mongodb/models/User';

/**
 * Error response helper
 */
function errorResponse(status: number, message: string) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

/**
 * GET /api/users
 * 
 * Get all users (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    // Get user session
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return errorResponse(401, 'Unauthorized');
    }
    
    // Connect to database
    await connectDB();
    
    // Get user from database
    const currentUser = await User.findByEmail(session.user.email);
    
    // Check if user exists and is an admin
    if (!currentUser || currentUser.role !== 'admin') {
      return errorResponse(403, 'Forbidden: Admin access required');
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Get users with pagination
    const users = await User.find({})
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await User.countDocuments({});
    
    // Return users
    return NextResponse.json({
      users: users.map(user => user.getPublicProfile()),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/users:', error);
    
    // Return appropriate error response
    return errorResponse(
      500,
      'An error occurred while fetching users'
    );
  }
}

/**
 * POST /api/users
 * 
 * Create a new user (from Auth0 webhook)
 */
export async function POST(req: NextRequest) {
  try {
    // Get request body
    const body = await req.json();
    
    // Validate webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret');
    const expectedSecret = process.env.AUTH0_WEBHOOK_SECRET;
    
    if (!webhookSecret || webhookSecret !== expectedSecret) {
      return errorResponse(401, 'Unauthorized: Invalid webhook secret');
    }
    
    // Validate required fields
    if (!body.auth0Id || !body.email || !body.name) {
      return errorResponse(400, 'Bad Request: Missing required fields');
    }
    
    // Connect to database
    await connectDB();
    
    // Create or update user
    const userData = {
      auth0Id: body.auth0Id,
      email: body.email,
      name: body.name,
      picture: body.picture,
      lastLogin: new Date()
    };
    
    const user = await User.createOrUpdateUser(userData);
    
    // Return success response
    return NextResponse.json(
      {
        message: user.createdAt.getTime() === user.updatedAt.getTime() 
          ? 'User created successfully' 
          : 'User updated successfully',
        user: user.getPublicProfile()
      },
      { status: user.createdAt.getTime() === user.updatedAt.getTime() ? 201 : 200 }
    );
  } catch (error: any) {
    console.error('Error in POST /api/users:', error);
    
    // Handle duplicate key error
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return errorResponse(
        409,
        'Conflict: User with this email already exists'
      );
    }
    
    // Handle validation error
    if (error.name === 'ValidationError') {
      return errorResponse(
        400,
        `Validation Error: ${error.message}`
      );
    }
    
    // Return generic error for other cases
    return errorResponse(
      500,
      'An error occurred while creating the user'
    );
  }
} 