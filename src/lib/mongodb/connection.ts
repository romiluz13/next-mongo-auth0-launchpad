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

// Connection state tracking
let isConnected = false;

// Connection options
const options: mongoose.ConnectOptions = {
  // Connection pooling settings
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 5,  // Minimum number of connections in the pool
  
  // Socket timeout settings
  socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  
  // Heartbeat settings (keep connections alive)
  heartbeatFrequencyMS: 10000, // Check connection health every 10 seconds
  
  // Auto reconnect settings
  autoCreate: true, // Create database/collections if they don't exist
  autoIndex: true,  // Build indexes
  
  // Write concern settings
  writeConcern: {
    w: 'majority', // Wait for the write to be acknowledged by a majority of replicas
    j: true,       // Wait for the write to be committed to the journal
  },
  
  // Read concern settings
  readConcern: { level: 'local' }, // Read from the local replica
  
  // Read preference settings (for replica sets)
  readPreference: 'primary', // Read from the primary node
};

/**
 * Connect to MongoDB
 * 
 * This function establishes a connection to MongoDB using the provided URI.
 * It implements connection pooling and automatic reconnection.
 * 
 * @returns Promise<mongoose.Connection> The MongoDB connection
 */
export async function connectToDatabase(): Promise<mongoose.Connection> {
  // If we're already connected, return the existing connection
  if (isConnected) {
    return mongoose.connection;
  }

  // Get MongoDB URI from environment variables
  const uri = process.env.MONGODB_URI;
  
  // Validate MongoDB URI
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(uri, options);
    
    // Update connection state
    isConnected = mongoose.connection.readyState === 1;
    
    // Log connection success
    console.log('MongoDB connected successfully');
    
    // Set up connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      isConnected = true;
    });
    
    // Return the mongoose connection
    return mongoose.connection;
  } catch (error) {
    // Log connection error
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 * 
 * This function gracefully closes the MongoDB connection.
 * It should be called when the application is shutting down.
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (!isConnected) {
    return;
  }
  
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
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
 * Utility function to handle MongoDB operation errors
 * 
 * @param error The error object
 * @param operation The operation that failed (e.g., 'find', 'update')
 * @param model The model name (e.g., 'User', 'Product')
 * @returns Error A formatted error object
 */
export function handleMongoDBError(error: any, operation: string, model: string): Error {
  // Log the error
  console.error(`MongoDB ${operation} error on ${model}:`, error);
  
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