# MongoDB Developer's Launch Pad 🚀

A production-ready, full-stack starter template built on Next.js, MongoDB, and Auth0 designed for modern web application development.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Auth0](https://img.shields.io/badge/Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## Overview

MongoDB Developer's Launch Pad is the ultimate starting point for building modern, MongoDB-powered web applications. This template combines the power of Next.js 14's App Router, MongoDB's flexible document database, and Auth0's enterprise-grade authentication into a cohesive, production-ready solution with MongoDB-inspired design.

## ✨ Features

### Current Features
- 🎯 **Next.js 14 App Router** - Server components and modern routing
- 🔐 **Auth0 Authentication** - Secure, scalable user management
- 📚 **MongoDB + Mongoose** - Type-safe database operations
- 🎨 **Tailwind CSS** - Beautiful, responsive design with dark mode
- 📱 **Dashboard & Team Management** - Ready-to-use admin interface
- 🔑 **API Key Management** - Secure API access control
- 🧪 **Testing Suite** - Jest & React Testing Library
- 🐳 **Docker Support** - Production-ready containerization
- 📝 **TypeScript** - Full type safety
- 🛠️ **Developer Tools** - ESLint, Prettier, Husky

### Architecture
- 🎯 **Feature-Based Organization** - Intuitive project structure for scalability
- 🧩 **Clean Separation** - Business logic decoupled from UI components
- 🔄 **Server/Client Boundaries** - Clear distinction between server and client code
- 📱 **Responsive Design** - Optimized for all device sizes

### MongoDB Integration
- 🔌 **Optimized Connection** - Advanced connection pooling and error handling
- 📊 **Robust Models** - Type-safe Mongoose models with validation
- 🔍 **Indexing Strategies** - Performance-optimized database queries
- 📈 **Aggregation Pipelines** - Ready-to-use MongoDB aggregation examples

### Authentication & Security
- 🔐 **Auth0 Integration** - Enterprise-grade authentication
- 👥 **Role-Based Access** - Granular permission controls
- 🔄 **Token Management** - Automatic token refresh handling
- 🛡️ **Security Headers** - Comprehensive protection against common vulnerabilities

### UI Components
- 💎 **MongoDB Design System** - Components inspired by MongoDB Atlas
- 🌓 **Dark Mode** - Consistent theme based on MongoDB Cloud
- 📊 **Data Visualization** - Beautiful charts and dashboards
- 📝 **Form Handling** - Integrated React Hook Form with validation

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/romiluz13/ai-devs-launchpad.git
cd ai-devs-launchpad

# Install dependencies
npm install

# Set up your environment variables
cp .env.example .env.local
# The .env.example file contains detailed instructions for:
# - Setting up Auth0 (authentication)
# - Setting up MongoDB (database)
# - Optional configurations
# Follow the instructions in the file to get your credentials

# Verify your setup (these will help you check your configuration)
npm run verify:mongodb  # Check MongoDB connection
npm run verify:auth0   # Check Auth0 configuration

# Clean up template files (optional)
npm run cleanup

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to see your application running.

## 🔧 Utility Scripts

This template includes several utility scripts to help you verify and set up your project:

### 1. MongoDB Verification
```bash
npx tsx scripts/verify-mongodb.ts

# This will:
# ✓ Check if MONGODB_URI is configured
# ✓ Test the database connection
# ✓ Show database statistics and indexes
```

### 2. Auth0 Verification
```bash
npx tsx scripts/verify-auth0.ts

# This will:
# ✓ Verify all required Auth0 variables
# ✓ Test connection to Auth0
# ✓ Validate your configuration
```

### 3. Project Cleanup
```bash
chmod +x scripts/cleanup.sh
./scripts/cleanup.sh

# This will:
# ✓ Remove unnecessary UI components
# ✓ Organize project structure
# ✓ Create essential directories
# ✓ Update import paths
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/         # Auth0 routes
│   │   ├── user/         # User management
│   │   └── keys/         # API key management
│   ├── dashboard/        # Dashboard pages
│   └── (auth)/          # Auth-related routes
├── components/
│   ├── ui/              # Reusable UI components
│   └── layout/          # Layout components
├── lib/
│   ├── models/         # Mongoose models
│   └── utils/          # Helper functions
└── styles/             # Global styles
```

## 🔐 Key Features

### Authentication
- Secure Auth0 integration
- Social provider support
- JWT token handling
- Protected routes

### Database
- MongoDB connection pooling
- Type-safe Mongoose models
- Automatic timestamps
- Indexed collections

### Dashboard
- Real-time statistics
- Team management
- API key management
- Dark mode support
- Responsive design

## 💻 MongoDB Integration

### Connection Pooling
```typescript
// Optimized MongoDB connection with proper pooling
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
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
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

## 🧪 Development

```bash
# Run tests
npm test

# Check code style
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## 🐳 Deployment

### Docker

```bash
# Build image
docker build -t mongodb-developer-launchpad .

# Run container
docker run -p 3000:3000 mongodb-developer-launchpad
```

### Development with Docker Compose

```bash
# Start development environment
docker-compose up
```

## 📚 Documentation

### Getting Started
1. **Prerequisites**:
   - Node.js >= 18
   - MongoDB Atlas account
   - Auth0 account

2. **Initial Setup**:
   ```bash
   # Clone and install
   git clone https://github.com/romiluz13/ai-devs-launchpad.git
   cd ai-devs-launchpad
   npm install

   # Environment setup
   cp .env.example .env.local
   # Follow the instructions in .env.example
   ```

3. **Configuration**:
   - Set up Auth0:
     1. Create new application in Auth0 Dashboard
     2. Choose "Regular Web Application"
     3. Add `http://localhost:3000/api/auth/callback` to Allowed Callback URLs
     4. Add `http://localhost:3000` to Allowed Logout URLs
     5. Copy credentials to `.env.local`

   - Set up MongoDB:
     1. Create cluster in MongoDB Atlas
     2. Get connection string
     3. Add to `.env.local`

### Authentication
- Uses Auth0 for secure authentication
- Supports social providers (Google, GitHub, etc.)
- Protected API routes and pages
- Automatic token handling
- Session management

### Database
- MongoDB with Mongoose
- Auto-generated TypeScript types
- Built-in models:
  - User
  - Team
  - API Keys
- Connection pooling
- Automatic timestamps

### Deployment
1. **Standard Deployment**:
   ```bash
   npm run build
   npm start
   ```

2. **Docker Deployment**:
   ```bash
   # Build image
   docker build -t mongodb-developer-launchpad .

   # Run container
   docker run -p 3000:3000 mongodb-developer-launchpad
   ```

3. **Environment Variables**:
   - Copy `.env.example` to `.env.local`
   - Update with production values
   - Ensure HTTPS in production

### Testing
- Unit Tests: `npm test`
- Coverage: `npm run test:coverage`
- E2E Tests: Coming soon
- Test utilities included

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- MongoDB for the incredible database technology and design inspiration
- Vercel for Next.js
- Auth0 for authentication
- The open source community for inspiration

---

Built with ❤️ by [Rom Iluz](https://github.com/romiluz13) and the MongoDB Developer Experience Team
