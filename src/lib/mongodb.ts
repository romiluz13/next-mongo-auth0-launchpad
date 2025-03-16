/**
 * MongoDB Connection Utility
 * 
 * This module provides a robust MongoDB connection utility with:
 * - Connection pooling
 * - Automatic reconnection
 * - Proper error handling
 * - Debug logging
 * - Connection status tracking
 */

import mongoose from 'mongoose';
import { logger } from './logger';

// Validate MongoDB URI
if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Connection state tracking
let isConnected = false;

// Connection options
const connectionOptions: mongoose.ConnectOptions = {
  // Connection pooling settings
  maxPoolSize: 10,           // Maximum number of connections in the pool
  minPoolSize: 5,            // Minimum number of connections in the pool
  
  // Socket timeout settings
  socketTimeoutMS: 30000,    // Close sockets after 30 seconds of inactivity
  connectTimeoutMS: 10000,   // Give up initial connection after 10 seconds
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  
  // Heartbeat settings (keep connections alive)
  heartbeatFrequencyMS: 10000, // Check connection health every 10 seconds
  
  // Auto reconnect settings
  autoCreate: true,          // Create database/collections if they don't exist
  autoIndex: true,           // Build indexes
  
  // Write concern settings
  writeConcern: {
    w: 'majority',           // Wait for the write to be acknowledged by a majority of replicas
    j: true,                 // Wait for the write to be committed to the journal
  },
  
  // Read concern settings
  readConcern: { level: 'local' }, // Read from the local replica
  
  // Read preference settings (for replica sets)
  readPreference: 'primary', // Read from the primary node
  
  // Additional settings
  bufferCommands: false,     // Disable buffering of commands
  family: 4,                 // Use IPv4, skip trying IPv6
  retryWrites: true,         // Enable retry for write operations
  retryReads: true,          // Enable retry for read operations
};

// Cache the connection
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use global to maintain a cached connection across hot reloads in development
declare global {
  var mongoose: MongooseConnection;
}

let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB
 * 
 * This function establishes a connection to MongoDB using the provided URI.
 * It implements connection pooling and automatic reconnection.
 * 
 * @returns Promise<typeof mongoose> The mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // If we already have a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If we're in the process of connecting, wait for it
  if (!cached.promise) {
    logger.info('Connecting to MongoDB...');
    
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!, connectionOptions)
      .then((mongoose) => {
        isConnected = mongoose.connection.readyState === 1;
        logger.info('Connected to MongoDB successfully');
        
        // Set up connection event handlers
        mongoose.connection.on('error', (err) => {
          logger.error('MongoDB connection error:', err);
          isConnected = false;
        });
        
        mongoose.connection.on('disconnected', () => {
          logger.warn('MongoDB disconnected. Attempting to reconnect...');
          isConnected = false;
        });
        
        mongoose.connection.on('reconnected', () => {
          logger.info('MongoDB reconnected successfully');
          isConnected = true;
        });
        
        return mongoose;
      })
      .catch((err) => {
        logger.error('Failed to connect to MongoDB:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    logger.error('Error establishing MongoDB connection:', e);
    throw e;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB
 * 
 * This function gracefully closes the MongoDB connection.
 * It should be called when the application is shutting down.
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (!isConnected || !cached.conn) {
    return;
  }
  
  try {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    isConnected = false;
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

/**
 * Get MongoDB connection status
 * 
 * @returns boolean True if connected, false otherwise
 */
export function getConnectionStatus(): boolean {
  return isConnected;
}

/**
 * Get MongoDB connection instance
 * 
 * @returns mongoose.Connection The MongoDB connection
 */
export function getConnection(): mongoose.Connection {
  return mongoose.connection;
}

/**
 * Start a MongoDB session for transactions
 * 
 * @returns Promise<mongoose.ClientSession> A MongoDB session
 */
export async function startSession(): Promise<mongoose.ClientSession> {
  await connectDB();
  return await mongoose.startSession();
}

/**
 * Utility function to handle MongoDB operation errors
 * 
 * @param error The error object
 * @param operation The operation that failed (e.g., 'find', 'update')
 * @param model The model name (e.g., 'User', 'Product')
 * @returns Error A formatted error object
 */
export function handleMongoDBError(error: any, operation: string, model: string): Error {
  // Log the error
  logger.error(`MongoDB ${operation} error on ${model}:`, error);
  
  // Handle specific MongoDB errors
  if (error.name === 'ValidationError') {
    return new Error(`Validation error: ${error.message}`);
  }
  
  if (error.name === 'MongoServerError' && error.code === 11000) {
    return new Error(`Duplicate key error: ${JSON.stringify(error.keyValue)}`);
  }
  
  if (error.name === 'CastError') {
    return new Error(`Invalid ID format: ${error.value}`);
  }
  
  // Return a generic error for other cases
  return new Error(`Database error during ${operation} on ${model}`);
}

export default connectDB; 