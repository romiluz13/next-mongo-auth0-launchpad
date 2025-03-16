/**
 * Users API Tests
 * 
 * This file contains tests for the users API endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { GET, POST } from '@/app/api/users/route';
import User from '@/lib/mongodb/models/User';
import { connectToDatabase } from '@/lib/mongodb/connection';

// Mock dependencies
jest.mock('@auth0/nextjs-auth0', () => ({
  getSession: jest.fn(),
}));

jest.mock('@/lib/mongodb/connection', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('@/lib/mongodb/models/User', () => {
  return {
    __esModule: true,
    default: {
      find: jest.fn(),
      findOne: jest.fn(),
      findByAuth0Id: jest.fn(),
      findByEmail: jest.fn(),
      countDocuments: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
});

// Mock NextRequest
function createMockRequest(url: string, options: any = {}): NextRequest {
  const { headers = {}, method = 'GET', body = null } = options;
  
  return {
    url,
    method,
    headers: {
      get: (name: string) => headers[name] || null,
    },
    json: jest.fn().mockResolvedValue(body),
    nextUrl: new URL(url),
  } as unknown as NextRequest;
}

describe('Users API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /api/users', () => {
    it('should return 401 if user is not authenticated', async () => {
      // Mock getSession to return null (not authenticated)
      (getSession as jest.Mock).mockResolvedValue(null);
      
      // Create mock request
      const req = createMockRequest('http://localhost:3000/api/users');
      
      // Call the API handler
      const response = await GET(req);
      
      // Check response
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
    
    it('should return 403 if user is not an admin', async () => {
      // Mock getSession to return a non-admin user
      (getSession as jest.Mock).mockResolvedValue({
        user: { email: 'user@example.com' },
      });
      
      // Mock database connection
      (connectToDatabase as jest.Mock).mockResolvedValue({});
      
      // Mock User.findByEmail to return a non-admin user
      (User.findByEmail as jest.Mock).mockResolvedValue({
        role: 'user',
      });
      
      // Create mock request
      const req = createMockRequest('http://localhost:3000/api/users');
      
      // Call the API handler
      const response = await GET(req);
      
      // Check response
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden: Admin access required');
    });
    
    it('should return users if user is an admin', async () => {
      // Mock getSession to return an admin user
      (getSession as jest.Mock).mockResolvedValue({
        user: { email: 'admin@mongodb.com' },
      });
      
      // Mock database connection
      (connectToDatabase as jest.Mock).mockResolvedValue({});
      
      // Mock User.findByEmail to return an admin user
      (User.findByEmail as jest.Mock).mockResolvedValue({
        role: 'admin',
      });
      
      // Mock User.find to return users
      const mockUsers = [
        { getPublicProfile: () => ({ id: '1', name: 'User 1' }) },
        { getPublicProfile: () => ({ id: '2', name: 'User 2' }) },
      ];
      
      const mockFindChain = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockUsers),
      };
      
      (User.find as jest.Mock).mockReturnValue(mockFindChain);
      (User.countDocuments as jest.Mock).mockResolvedValue(2);
      
      // Create mock request
      const req = createMockRequest('http://localhost:3000/api/users?page=1&limit=10');
      
      // Call the API handler
      const response = await GET(req);
      
      // Check response
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.users).toHaveLength(2);
      expect(data.pagination).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        pages: 1,
      });
    });
  });
  
  describe('POST /api/users', () => {
    it('should return 401 if webhook secret is invalid', async () => {
      // Create mock request with invalid webhook secret
      const req = createMockRequest('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'x-webhook-secret': 'invalid-secret',
        },
        body: {
          auth0Id: 'auth0|123',
          email: 'test@example.com',
          name: 'Test User',
        },
      });
      
      // Set environment variable
      process.env.AUTH0_WEBHOOK_SECRET = 'valid-secret';
      
      // Call the API handler
      const response = await POST(req);
      
      // Check response
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized: Invalid webhook secret');
    });
    
    it('should return 400 if required fields are missing', async () => {
      // Create mock request with missing fields
      const req = createMockRequest('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'x-webhook-secret': 'valid-secret',
        },
        body: {
          // Missing auth0Id, email, and name
        },
      });
      
      // Set environment variable
      process.env.AUTH0_WEBHOOK_SECRET = 'valid-secret';
      
      // Call the API handler
      const response = await POST(req);
      
      // Check response
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Bad Request: Missing required fields');
    });
    
    it('should update existing user if auth0Id already exists', async () => {
      // Create mock request
      const req = createMockRequest('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'x-webhook-secret': 'valid-secret',
        },
        body: {
          auth0Id: 'auth0|123',
          email: 'test@example.com',
          name: 'Test User',
        },
      });
      
      // Set environment variable
      process.env.AUTH0_WEBHOOK_SECRET = 'valid-secret';
      
      // Mock database connection
      (connectToDatabase as jest.Mock).mockResolvedValue({});
      
      // Mock User.findByAuth0Id to return an existing user
      const mockUser = {
        lastLogin: new Date(),
        save: jest.fn().mockResolvedValue({}),
        getPublicProfile: jest.fn().mockReturnValue({
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        }),
      };
      
      (User.findByAuth0Id as jest.Mock).mockResolvedValue(mockUser);
      
      // Call the API handler
      const response = await POST(req);
      
      // Check response
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('User login recorded');
      expect(data.user).toBeDefined();
      
      // Check that save was called
      expect(mockUser.save).toHaveBeenCalled();
    });
    
    it('should create a new user if auth0Id does not exist', async () => {
      // Create mock request
      const req = createMockRequest('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'x-webhook-secret': 'valid-secret',
        },
        body: {
          auth0Id: 'auth0|123',
          email: 'test@example.com',
          name: 'Test User',
        },
      });
      
      // Set environment variable
      process.env.AUTH0_WEBHOOK_SECRET = 'valid-secret';
      
      // Mock database connection
      (connectToDatabase as jest.Mock).mockResolvedValue({});
      
      // Mock User.findByAuth0Id to return null (user doesn't exist)
      (User.findByAuth0Id as jest.Mock).mockResolvedValue(null);
      
      // Mock User constructor and save method
      const mockSave = jest.fn().mockResolvedValue({});
      const mockGetPublicProfile = jest.fn().mockReturnValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      });
      
      // @ts-ignore - Mocking constructor
      User.mockImplementation(() => ({
        save: mockSave,
        getPublicProfile: mockGetPublicProfile,
      }));
      
      // Call the API handler
      const response = await POST(req);
      
      // Check response
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.message).toBe('User created successfully');
      expect(data.user).toBeDefined();
      
      // Check that save was called
      expect(mockSave).toHaveBeenCalled();
    });
  });
}); 