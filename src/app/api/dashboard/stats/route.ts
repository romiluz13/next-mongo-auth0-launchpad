/**
 * Dashboard Statistics API
 * 
 * This API endpoint provides dashboard statistics using MongoDB aggregation pipelines.
 * It demonstrates advanced MongoDB query techniques.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getDashboardStats, getUserActivityStats, getUserRegistrationsByMonth, getUserStatsByRole } from '@/lib/mongodb/aggregations/dashboardStats';
import User from '@/lib/mongodb/models/User';
import connectDB from '@/lib/mongodb';

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
 * GET /api/dashboard/stats
 * 
 * Get dashboard statistics (admin only)
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
    const type = url.searchParams.get('type') || 'all';
    
    // Return appropriate statistics based on type
    switch (type) {
      case 'role':
        return NextResponse.json(await getUserStatsByRole());
        
      case 'monthly':
        const year = parseInt(url.searchParams.get('year') || new Date().getFullYear().toString());
        return NextResponse.json(await getUserRegistrationsByMonth(year));
        
      case 'activity':
        const days = parseInt(url.searchParams.get('days') || '30');
        return NextResponse.json(await getUserActivityStats(days));
        
      case 'all':
      default:
        return NextResponse.json(await getDashboardStats());
    }
  } catch (error: any) {
    console.error('Error in GET /api/dashboard/stats:', error);
    
    // Return appropriate error response
    return errorResponse(
      500,
      'An error occurred while fetching dashboard statistics'
    );
  }
} 