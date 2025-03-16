/**
 * User Model
 * 
 * This module defines the User model for MongoDB using Mongoose.
 * It includes schema validation, indexes, and methods.
 */

import mongoose, { Document, Model, Schema } from 'mongoose';
import { handleMongoDBError } from '@/lib/mongodb';

// Define the User interface
export interface IUser extends Document {
  auth0Id: string;
  email: string;
  name: string;
  picture?: string;
  role: 'user' | 'admin';
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  getPublicProfile(): Partial<IUser>;
}

// Define the User schema
const UserSchema = new Schema<IUser>(
  {
    auth0Id: {
      type: String,
      required: [true, 'Auth0 ID is required'],
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    picture: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Picture must be a valid URL',
      },
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add compound index for faster queries
UserSchema.index({ email: 1, role: 1 });

// Add instance methods
UserSchema.methods.getPublicProfile = function(): Partial<IUser> {
  const userObject = this.toObject();
  
  // Remove sensitive fields
  delete userObject.auth0Id;
  delete userObject.__v;
  
  return userObject;
};

// Add static methods
interface UserModel extends Model<IUser> {
  findByAuth0Id(auth0Id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  createOrUpdateUser(userData: Partial<IUser>): Promise<IUser>;
}

UserSchema.statics.findByAuth0Id = async function(auth0Id: string): Promise<IUser | null> {
  try {
    return await this.findOne({ auth0Id });
  } catch (error) {
    throw handleMongoDBError(error, 'findByAuth0Id', 'User');
  }
};

UserSchema.statics.findByEmail = async function(email: string): Promise<IUser | null> {
  try {
    return await this.findOne({ email: email.toLowerCase() });
  } catch (error) {
    throw handleMongoDBError(error, 'findByEmail', 'User');
  }
};

UserSchema.statics.createOrUpdateUser = async function(userData: Partial<IUser>): Promise<IUser> {
  try {
    // Ensure email is lowercase
    if (userData.email) {
      userData.email = userData.email.toLowerCase();
    }
    
    // Try to find the user by auth0Id
    if (userData.auth0Id) {
      const existingUser = await this.findOne({ auth0Id: userData.auth0Id });
      
      if (existingUser) {
        // Update existing user
        Object.assign(existingUser, userData);
        return await existingUser.save();
      }
    }
    
    // Try to find the user by email
    if (userData.email) {
      const existingUser = await this.findOne({ email: userData.email });
      
      if (existingUser) {
        // Update existing user
        Object.assign(existingUser, userData);
        return await existingUser.save();
      }
    }
    
    // Create new user
    return await this.create(userData);
  } catch (error) {
    throw handleMongoDBError(error, 'createOrUpdateUser', 'User');
  }
};

// Create and export the User model
const User = (mongoose.models.User as UserModel) || 
  mongoose.model<IUser, UserModel>('User', UserSchema);

export default User; 