'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const { user } = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 text-4xl font-bold">Access Denied</h1>
        
        <div className="mx-auto max-w-2xl rounded-lg bg-gray-800/50 p-8 shadow-lg">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-500/10 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          
          <p className="mb-4 text-xl">
            {user ? (
              <>
                Sorry, <span className="font-semibold">{user.name}</span>, you don't have permission to access this page.
              </>
            ) : (
              <>You don't have permission to access this page.</>
            )}
          </p>
          
          <p className="mb-8 text-gray-400">
            This area requires additional permissions. Please contact your administrator if you believe you should have access.
          </p>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:justify-center">
            <Link
              href="/dashboard"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>
            
            <Link
              href="/"
              className="rounded-md border border-gray-600 px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 