"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useEffect } from "react";
import { 
  ArrowRightIcon, 
  CodeBracketIcon, 
  ServerIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  CubeIcon, 
  CommandLineIcon
} from "@heroicons/react/24/outline";
import { MongoDBLogo } from "@/features/layout/components/MongoDBLogo";

export default function Home() {
  const { user, isLoading, error } = useUser();

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      console.error("Auth error:", error);
    }
  }, [error]);

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-mongodb-dark">
        <div className="text-red-500">
          Authentication error. Please try again later.
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col relative overflow-hidden bg-mongodb-dark">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 border-b border-mongodb-dark-400">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-10 text-center">
            <div className="space-y-4 max-w-4xl animate-fade-in">
              <div className="flex justify-center mb-6">
                <MongoDBLogo className="text-white" width={180} height={48} />
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                Developer's{" "}
                <span className="text-mongodb-green">Launch Pad</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-xl text-mongodb-gray-300 md:text-2xl">
                A production-ready template for building modern web applications
                with MongoDB, Next.js, and Auth0.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                {isLoading ? (
                  <div className="h-12 w-40 animate-pulse rounded-md bg-mongodb-dark-400" />
                ) : !user ? (
                  <a
                    href="/api/auth/login"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-mongodb-green px-8 text-sm font-medium text-mongodb-dark shadow-lg shadow-mongodb-green/20 transition-all hover:bg-mongodb-green-400"
                  >
                    Get Started
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-mongodb-green px-8 text-sm font-medium text-mongodb-dark shadow-lg shadow-mongodb-green/20 transition-all hover:bg-mongodb-green-400"
                  >
                    Dashboard
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                )}
                
                <a
                  href="https://github.com/mongodb-developer/mongodb-nextjs-launch-pad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-mongodb-green/30 px-8 text-sm font-medium text-white transition-colors hover:bg-mongodb-dark-400"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
            
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
              <span className="rounded-full bg-mongodb-dark-400 px-4 py-1.5 text-sm text-mongodb-green">
                Next.js 14
              </span>
              <span className="rounded-full bg-mongodb-dark-400 px-4 py-1.5 text-sm text-mongodb-green">
                MongoDB
              </span>
              <span className="rounded-full bg-mongodb-dark-400 px-4 py-1.5 text-sm text-mongodb-green">
                Auth0
              </span>
              <span className="rounded-full bg-mongodb-dark-400 px-4 py-1.5 text-sm text-mongodb-green">
                TypeScript
              </span>
              <span className="rounded-full bg-mongodb-dark-400 px-4 py-1.5 text-sm text-mongodb-green">
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>

        {/* Visual Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-mongodb-green/10 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-mongodb-green/10 to-transparent blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 border-b border-mongodb-dark-400">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Everything You Need to{" "}
              <span className="text-mongodb-green">Build Fast</span>
            </h2>
            <p className="mx-auto max-w-[700px] text-lg text-mongodb-gray-300">
              A carefully crafted template with all the essential components for modern web development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-in">
            <div className="bg-mongodb-dark-500 border border-mongodb-dark-400 rounded-lg p-6 transition-transform hover:translate-y-[-4px]">
              <div className="h-12 w-12 rounded-lg bg-mongodb-green/10 mb-5 flex items-center justify-center">
                <ServerIcon className="h-6 w-6 text-mongodb-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">MongoDB Integration</h3>
              <p className="text-mongodb-gray-300">
                Pre-configured MongoDB connection with proper pooling, error handling, and models
              </p>
            </div>

            <div className="bg-mongodb-dark-500 border border-mongodb-dark-400 rounded-lg p-6 transition-transform hover:translate-y-[-4px]">
              <div className="h-12 w-12 rounded-lg bg-mongodb-green/10 mb-5 flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-mongodb-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Auth0 Authentication</h3>
              <p className="text-mongodb-gray-300">
                Secure authentication with token management and role-based access control
              </p>
            </div>

            <div className="bg-mongodb-dark-500 border border-mongodb-dark-400 rounded-lg p-6 transition-transform hover:translate-y-[-4px]">
              <div className="h-12 w-12 rounded-lg bg-mongodb-green/10 mb-5 flex items-center justify-center">
                <CodeBracketIcon className="h-6 w-6 text-mongodb-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Modern Architecture</h3>
              <p className="text-mongodb-gray-300">
                Feature-based folder organization with clear separation of concerns
              </p>
            </div>

            <div className="bg-mongodb-dark-500 border border-mongodb-dark-400 rounded-lg p-6 transition-transform hover:translate-y-[-4px]">
              <div className="h-12 w-12 rounded-lg bg-mongodb-green/10 mb-5 flex items-center justify-center">
                <BoltIcon className="h-6 w-6 text-mongodb-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Optimized Performance</h3>
              <p className="text-mongodb-gray-300">
                Built with Next.js 14 App Router and optimized for speed and SEO
              </p>
            </div>

            <div className="bg-mongodb-dark-500 border border-mongodb-dark-400 rounded-lg p-6 transition-transform hover:translate-y-[-4px]">
              <div className="h-12 w-12 rounded-lg bg-mongodb-green/10 mb-5 flex items-center justify-center">
                <CubeIcon className="h-6 w-6 text-mongodb-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">MongoDB UI Components</h3>
              <p className="text-mongodb-gray-300">
                Beautiful UI components styled with MongoDB's design system
              </p>
            </div>

            <div className="bg-mongodb-dark-500 border border-mongodb-dark-400 rounded-lg p-6 transition-transform hover:translate-y-[-4px]">
              <div className="h-12 w-12 rounded-lg bg-mongodb-green/10 mb-5 flex items-center justify-center">
                <CommandLineIcon className="h-6 w-6 text-mongodb-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">API Routes & Error Handling</h3>
              <p className="text-mongodb-gray-300">
                Ready-to-use API routes with standardized error handling and responses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Sample Section */}
      <section className="w-full py-20 border-b border-mongodb-dark-400">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                MongoDB Data Access Made <span className="text-mongodb-green">Simple</span>
              </h2>
              <p className="text-lg text-mongodb-gray-300">
                Our template includes pre-built models, optimized connection handling, and 
                utility functions for common database operations.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 h-5 w-5 text-mongodb-green">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-mongodb-gray-300">Connection pooling with retry logic</p>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 mr-4 h-5 w-5 text-mongodb-green">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-mongodb-gray-300">Mongoose models with validation</p>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 mr-4 h-5 w-5 text-mongodb-green">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-mongodb-gray-300">TypeScript interfaces for type safety</p>
                </div>
              </div>
              
              <div className="pt-4">
                <a
                  href="https://github.com/mongodb-developer/mongodb-nextjs-launch-pad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-mongodb-green hover:text-mongodb-green-400 transition-colors"
                >
                  View documentation
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="overflow-hidden rounded-lg bg-mongodb-dark-600 shadow-xl">
                <div className="flex items-center gap-2 border-b border-mongodb-dark-400 bg-mongodb-dark-500 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-sm text-mongodb-gray-300">connectDB.ts</div>
                </div>
                <div className="overflow-x-auto p-4">
                  <pre className="text-sm text-white">
                    <code>{`import mongoose from 'mongoose';
import { logger } from './logger';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global connection object
let cached: MongooseConnection = global.mongoose || {
  conn: null, 
  promise: null
};

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
      retryWrites: true,
      retryReads: true,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        logger.info('Connected to MongoDB successfully');
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="mx-auto max-w-3xl bg-mongodb-dark-500 rounded-2xl p-8 md:p-12 shadow-xl border border-mongodb-dark-400">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Ready to Start Building?
            </h2>
            <p className="mx-auto max-w-[700px] text-lg text-mongodb-gray-300 mb-8">
              Get started with our template and create powerful, MongoDB-backed applications in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isLoading ? (
                <div className="h-12 w-40 animate-pulse rounded-md bg-mongodb-dark-400" />
              ) : !user ? (
                <a
                  href="/api/auth/login"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-mongodb-green px-8 text-base font-medium text-mongodb-dark shadow-lg shadow-mongodb-green/20 transition-all hover:bg-mongodb-green-400"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </a>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-mongodb-green px-8 text-base font-medium text-mongodb-dark shadow-lg shadow-mongodb-green/20 transition-all hover:bg-mongodb-green-400"
                >
                  Go to Dashboard
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              )}
              
              <a
                href="https://github.com/mongodb-developer/mongodb-nextjs-launch-pad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md border border-mongodb-green/30 px-8 text-base font-medium text-white transition-colors hover:bg-mongodb-dark-400"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
