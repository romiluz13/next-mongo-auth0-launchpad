/**
 * CSRF Token API Route
 * 
 * This route generates CSRF tokens for protected form submissions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { generateCsrfToken } from '@/lib/csrf';
import { logger } from '@/lib/logger';

/**
 * GET /api/csrf
 * 
 * Generate a new CSRF token
 */
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Generate a new CSRF token
    const token = generateCsrfToken();
    
    // Return the token
    return NextResponse.json({ token });
  } catch (error) {
    logger.error('Error generating CSRF token:', error);
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 