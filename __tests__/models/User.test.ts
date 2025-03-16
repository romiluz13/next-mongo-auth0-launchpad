/**
 * User Model Tests
 * 
 * This file contains tests for the User model.
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User, { IUser } from '@/lib/mongodb/models/User';

// Setup in-memory MongoDB server
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear the database before each test
  await User.deleteMany({});
});

describe('User Model', () => {
  it('should create a new user successfully', async () => {
    const userData = {
      auth0Id: 'auth0|123456789',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg',
      role: 'user' as const,
      lastLogin: new Date(),
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Check that the user was saved correctly
    expect(savedUser._id).toBeDefined();
    expect(savedUser.auth0Id).toBe(userData.auth0Id);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.picture).toBe(userData.picture);
    expect(savedUser.role).toBe(userData.role);
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeDefined();
  });

  it('should fail validation when required fields are missing', async () => {
    const invalidUser = new User({
      // Missing auth0Id, email, and name
      picture: 'https://example.com/avatar.jpg',
      role: 'user',
    });

    let error: any = null;
    try {
      await invalidUser.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
    expect(error.errors.auth0Id).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.name).toBeDefined();
  });

  it('should fail validation with invalid email format', async () => {
    const invalidUser = new User({
      auth0Id: 'auth0|123456789',
      email: 'invalid-email', // Invalid email format
      name: 'Test User',
      role: 'user',
    });

    let error: any = null;
    try {
      await invalidUser.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
    expect(error.errors.email).toBeDefined();
  });

  it('should enforce unique auth0Id constraint', async () => {
    // Create first user
    const userData = {
      auth0Id: 'auth0|123456789',
      email: 'test1@example.com',
      name: 'Test User 1',
      role: 'user' as const,
    };

    await new User(userData).save();

    // Try to create second user with same auth0Id
    const duplicateUser = new User({
      auth0Id: 'auth0|123456789', // Same auth0Id
      email: 'test2@example.com', // Different email
      name: 'Test User 2',
      role: 'user',
    });

    let error: any = null;
    try {
      await duplicateUser.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('MongoServerError');
    expect(error.code).toBe(11000); // Duplicate key error code
  });

  it('should correctly use the getPublicProfile method', async () => {
    const userData = {
      auth0Id: 'auth0|123456789',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
    };

    const user = new User(userData);
    await user.save();

    const publicProfile = user.getPublicProfile();
    const userObject = user.toObject();

    // Public profile should not contain auth0Id
    expect(publicProfile.auth0Id).toBeUndefined();
    // Check that __v is removed (this is added by Mongoose)
    expect('__v' in publicProfile).toBe(false);
    
    // But should contain other fields
    expect(publicProfile._id).toBeDefined();
    expect(publicProfile.email).toBe(userData.email);
    expect(publicProfile.name).toBe(userData.name);
    expect(publicProfile.role).toBe(userData.role);
  });

  it('should find a user by auth0Id', async () => {
    const userData = {
      auth0Id: 'auth0|123456789',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
    };

    await new User(userData).save();

    const foundUser = await User.findByAuth0Id(userData.auth0Id);

    expect(foundUser).toBeDefined();
    expect(foundUser?.auth0Id).toBe(userData.auth0Id);
    expect(foundUser?.email).toBe(userData.email);
  });

  it('should find a user by email', async () => {
    const userData = {
      auth0Id: 'auth0|123456789',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
    };

    await new User(userData).save();

    const foundUser = await User.findByEmail(userData.email);

    expect(foundUser).toBeDefined();
    expect(foundUser?.auth0Id).toBe(userData.auth0Id);
    expect(foundUser?.email).toBe(userData.email);
  });
}); 