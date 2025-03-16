import { Session } from '@auth0/nextjs-auth0';
import { User } from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { logger } from '@/lib/logger';

/**
 * Synchronizes user data between Auth0 and MongoDB
 * Creates or updates the user record in MongoDB based on Auth0 session data
 */
export async function syncUserWithDatabase(session: Session): Promise<any> {
  if (!session?.user) {
    logger.warn('No user in session during sync attempt');
    return null;
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Extract user data from Auth0 session
    const { sub, email, name, picture } = session.user;

    if (!sub || !email) {
      logger.warn('Missing required user data (sub or email) during sync');
      return null;
    }

    // Find and update or create user
    const user = await User.findOneAndUpdate(
      { auth0Id: sub },
      {
        auth0Id: sub,
        email,
        name: name || email.split('@')[0], // Use part of email as name if not provided
        picture,
        lastLogin: new Date(),
      },
      { upsert: true, new: true }
    );

    logger.info(`User synced successfully: ${sub}`);
    return user;
  } catch (error) {
    logger.error('Error syncing user with database:', error);
    throw error;
  }
}

/**
 * Updates specific user data in the database
 */
export async function updateUserData(auth0Id: string, data: Partial<any>): Promise<any> {
  if (!auth0Id) {
    logger.warn('No auth0Id provided for user update');
    return null;
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Update user data
    const user = await User.findOneAndUpdate(
      { auth0Id },
      { 
        ...data,
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!user) {
      logger.warn(`User not found during update: ${auth0Id}`);
      return null;
    }

    logger.info(`User updated successfully: ${auth0Id}`);
    return user;
  } catch (error) {
    logger.error('Error updating user data:', error);
    throw error;
  }
}

/**
 * Gets user data from the database
 */
export async function getUserFromDatabase(auth0Id: string): Promise<any> {
  if (!auth0Id) {
    logger.warn('No auth0Id provided for user lookup');
    return null;
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Find user
    const user = await User.findOne({ auth0Id });

    if (!user) {
      logger.warn(`User not found: ${auth0Id}`);
      return null;
    }

    return user;
  } catch (error) {
    logger.error('Error getting user from database:', error);
    throw error;
  }
} 