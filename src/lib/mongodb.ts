import mongoose from 'mongoose';
import { logger } from './logger';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseConnection;
}

let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Set maximum pool size
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Timeout for socket operations
      family: 4, // Use IPv4, skip trying IPv6
      connectTimeoutMS: 10000, // Connection timeout
      retryWrites: true, // Enable retry for write operations
      retryReads: true, // Enable retry for read operations
    };

    logger.info('Connecting to MongoDB...');
    
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!, opts)
      .then((mongoose) => {
        logger.info('Connected to MongoDB successfully');
        
        // Set up connection error handlers
        mongoose.connection.on('error', (err) => {
          logger.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
          logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });
        
        mongoose.connection.on('reconnected', () => {
          logger.info('MongoDB reconnected successfully');
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

export default connectDB; 