# MongoDB Integration

This document outlines how MongoDB is integrated into the MongoDB Developer's Launch Pad template.

## Connection Setup

MongoDB connection is managed through a centralized connection utility in `src/lib/mongodb.ts`. This ensures proper connection pooling and error handling.

### Key Features

- **Connection Pooling**: Optimized connection handling with configurable pool size
- **Automatic Reconnection**: Handles connection drops and reconnects automatically
- **Error Handling**: Comprehensive error management for database operations
- **Caching**: Connection caching to prevent multiple connections during development
- **Transactions Support**: Helper functions for MongoDB transactions
- **Logging**: Detailed logging of connection events

### Connection Options

```typescript
const connectionOptions: mongoose.ConnectOptions = {
  // Connection pooling settings
  maxPoolSize: 10,           // Maximum number of connections in the pool
  minPoolSize: 5,            // Minimum number of connections in the pool
  
  // Socket timeout settings
  socketTimeoutMS: 30000,    // Close sockets after 30 seconds of inactivity
  connectTimeoutMS: 10000,   // Give up initial connection after 10 seconds
  
  // Write concern settings
  writeConcern: {
    w: 'majority',           // Wait for the write to be acknowledged by a majority of replicas
    j: true,                 // Wait for the write to be committed to the journal
  },
  
  // Read concern settings
  readConcern: { level: 'local' }, // Read from the local replica
};
```

## Data Models

Mongoose models are defined in the `src/lib/mongodb/models` directory. Each model includes:

- Schema definition with validation
- TypeScript interfaces
- Static and instance methods
- Proper indexes

### Example Model: User

```typescript
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
    // ... other fields
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);
```

## Example Usage

### Server Component Data Fetching

```tsx
// app/users/page.tsx
import { getUsers } from '@/lib/models/user';

export default async function UsersPage() {
  const users = await getUsers();
  
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### API Route Handler

```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { createUser } from '@/lib/models/user';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const user = await createUser(data);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

## Error Handling

MongoDB operations are wrapped in try/catch blocks with proper error handling. Common error types are identified and handled appropriately:

```typescript
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
```

## Transactions

For operations that require atomicity across multiple documents, MongoDB transactions are used:

```typescript
import { startSession } from '@/lib/mongodb';

async function transferFunds(fromAccountId, toAccountId, amount) {
  const session = await startSession();
  
  try {
    session.startTransaction();
    
    // Perform operations within the transaction
    await decreaseBalance(fromAccountId, amount, { session });
    await increaseBalance(toAccountId, amount, { session });
    
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

## Aggregation Pipelines

MongoDB's powerful aggregation framework is used for complex data operations. The template includes several examples in `src/lib/mongodb/aggregations/`:

### Example: Dashboard Statistics

```typescript
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
```

## Usage in API Routes

MongoDB connection and models are used in API routes:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/mongodb/models/User';

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    
    // Get users with pagination
    const users = await User.find({})
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Return users
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
```

## Future Enhancements

- Implementation of more advanced MongoDB features
- Data validation with Zod
- Type generation for MongoDB schemas
- Performance optimization for queries 