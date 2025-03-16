import { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import connectDB from '@/lib/mongodb';
import { ApiKey } from '@/lib/models/ApiKey';
import { createErrorResponse, createSuccessResponse, handleApiError, validateRequestData } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

/**
 * GET /api/keys
 * Returns the API keys for the current user
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

    // Find API keys for the user
    const apiKeys = await ApiKey.find({ userId: session.user.sub })
      .select('-key') // Don't return the actual key for security
      .sort({ createdAt: -1 });

    // Return API keys
    return createSuccessResponse(apiKeys);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/keys
 * Creates a new API key
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

    // Generate API key
    const keyString = crypto.randomBytes(32).toString('hex');
    const keyPrefix = 'mk_';
    const displayKey = `${keyPrefix}${keyString.substring(0, 24)}`;
    
    // Hash the key for storage
    const hashedKey = crypto
      .createHash('sha256')
      .update(displayKey)
      .digest('hex');

    // Create new API key
    const apiKey = new ApiKey({
      name: body.name,
      userId: session.user.sub,
      key: hashedKey,
      prefix: keyPrefix,
      lastUsed: null,
      createdAt: new Date(),
      expiresAt: body.expiresAt || null,
    });

    // Save API key
    await apiKey.save();
    logger.info(`API key created: ${apiKey._id} by user ${session.user.sub}`);

    // Return created API key with the full key (only time it's exposed)
    return createSuccessResponse({
      ...apiKey.toObject(),
      key: displayKey,
    }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/keys
 * Deletes an API key
 */
export async function DELETE(req: NextRequest) {
  try {
    // Get Auth0 session
    const session = await getSession();
    
    if (!session?.user) {
      return createErrorResponse('Not authenticated', 401);
    }

    // Get key ID from URL
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get('id');
    
    if (!keyId) {
      return createErrorResponse('Missing key ID', 400);
    }

    // Connect to MongoDB
    await connectDB();

    // Find and delete API key
    const apiKey = await ApiKey.findOneAndDelete({
      _id: keyId,
      userId: session.user.sub,
    });

    if (!apiKey) {
      return createErrorResponse('API key not found', 404);
    }

    logger.info(`API key deleted: ${keyId} by user ${session.user.sub}`);

    // Return success
    return createSuccessResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
} 