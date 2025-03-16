/**
 * Dashboard Statistics Aggregation Pipelines
 * 
 * This module provides MongoDB aggregation pipelines for dashboard statistics.
 * It demonstrates advanced MongoDB aggregation techniques.
 */

import mongoose from 'mongoose';
import User from '../models/User';
import connectDB, { handleMongoDBError } from '@/lib/mongodb';

/**
 * Get user statistics by role
 * 
 * @returns Promise<{ role: string, count: number }[]>
 */
export async function getUserStatsByRole() {
  try {
    await connectDB();
    
    return await User.aggregate([
      // Group users by role
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      // Format the output
      {
        $project: {
          _id: 0,
          role: '$_id',
          count: 1
        }
      },
      // Sort by count descending
      {
        $sort: { count: -1 }
      }
    ]);
  } catch (error) {
    throw handleMongoDBError(error, 'getUserStatsByRole', 'User');
  }
}

/**
 * Get user registration statistics by month
 * 
 * @param year The year to get statistics for (defaults to current year)
 * @returns Promise<{ month: number, count: number }[]>
 */
export async function getUserRegistrationsByMonth(year = new Date().getFullYear()) {
  try {
    await connectDB();
    
    const startDate = new Date(year, 0, 1); // January 1st of the specified year
    const endDate = new Date(year + 1, 0, 1); // January 1st of the next year
    
    return await User.aggregate([
      // Filter by creation date
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate
          }
        }
      },
      // Group by month
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      // Format the output
      {
        $project: {
          _id: 0,
          month: '$_id',
          count: 1
        }
      },
      // Sort by month
      {
        $sort: { month: 1 }
      }
    ]);
  } catch (error) {
    throw handleMongoDBError(error, 'getUserRegistrationsByMonth', 'User');
  }
}

/**
 * Get user activity statistics
 * 
 * @param days Number of days to look back (defaults to 30)
 * @returns Promise<{ date: string, activeUsers: number }[]>
 */
export async function getUserActivityStats(days = 30) {
  try {
    await connectDB();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return await User.aggregate([
      // Filter by last login date
      {
        $match: {
          lastLogin: {
            $gte: cutoffDate
          }
        }
      },
      // Group by date
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$lastLogin'
            }
          },
          activeUsers: { $sum: 1 }
        }
      },
      // Format the output
      {
        $project: {
          _id: 0,
          date: '$_id',
          activeUsers: 1
        }
      },
      // Sort by date
      {
        $sort: { date: 1 }
      }
    ]);
  } catch (error) {
    throw handleMongoDBError(error, 'getUserActivityStats', 'User');
  }
}

/**
 * Get comprehensive dashboard statistics
 * 
 * @returns Promise<Object> Dashboard statistics
 */
export async function getDashboardStats() {
  try {
    await connectDB();
    
    // Start a session for consistent reads
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Get total user count
      const totalUsers = await User.countDocuments({}).session(session);
      
      // Get user stats by role
      const usersByRole = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            role: '$_id',
            count: 1
          }
        }
      ]).session(session);
      
      // Get new users in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newUsers = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      }).session(session);
      
      // Get active users in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const activeUsers = await User.countDocuments({
        lastLogin: { $gte: sevenDaysAgo }
      }).session(session);
      
      // Get user registration trend (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const registrationTrend = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: 1
              }
            },
            count: 1
          }
        },
        {
          $sort: { date: 1 }
        }
      ]).session(session);
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      // Return the dashboard stats
      return {
        totalUsers,
        usersByRole,
        newUsers,
        activeUsers,
        registrationTrend
      };
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    throw handleMongoDBError(error, 'getDashboardStats', 'User');
  }
} 