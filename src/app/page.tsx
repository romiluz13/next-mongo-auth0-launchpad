'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading, error } = useUser();

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      console.error('Auth error:', error);
    }
  }, [error]);

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-black/[0.96]">
        <div className="text-red-500">
          Authentication error. Please try again later.
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-black to-gray-900">
      {/* MongoDB-inspired gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,237,100,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,158,67,0.05),transparent_70%)]" />
      
      <div className="container relative z-10 mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col items-center space-y-12 text-center">
          {/* Main Heading Section */}
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">MongoDB</span>
              <span className="text-white"> + </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Next.js</span>
              <span className="text-white"> + </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">Auth0</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-xl text-gray-300 dark:text-gray-400">
              A powerful full-stack starter template powered by MongoDB's flexible document database, Next.js 14's App Router, and Auth0's secure authentication.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-green-900/50">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">MongoDB Database</h3>
              <p className="text-gray-400">Flexible document schemas, powerful querying, and seamless integration.</p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-blue-900/50">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Next.js 14</h3>
              <p className="text-gray-400">App Router, React Server Components, and optimized performance.</p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-orange-900/50">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-600 mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Auth0 Security</h3>
              <p className="text-gray-400">Enterprise-grade authentication and authorization.</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="w-full max-w-md space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <div className="animate-pulse h-11 bg-white/10 rounded-md" />
                <div className="animate-pulse h-4 w-2/3 mx-auto bg-white/10 rounded-md" />
              </div>
            ) : !user ? (
              <a
                href="/api/auth/login"
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-gradient-to-r from-green-400 to-green-600 px-8 text-sm font-medium text-white transition-all hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                Start Building Now
              </a>
            ) : (
              <div className="space-y-4">
                <p className="text-xl text-gray-200">
                  Welcome back, {user.name}!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/dashboard"
                    className="flex-1 inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-green-400 to-green-600 px-8 text-sm font-medium text-white transition-all hover:from-green-500 hover:to-green-700"
                  >
                    Dashboard
                  </Link>
                  <a
                    href="/api/auth/logout"
                    className="flex-1 inline-flex h-12 items-center justify-center rounded-md border border-gray-600 px-8 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
                  >
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer Links */}
          <div className="flex flex-col sm:flex-row gap-4 text-center">
            <a
              href="https://github.com/yourusername/ai-devs-launchpad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-gray-800 px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:border-gray-700"
            >
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
            <a
              href="/docs"
              className="inline-flex items-center justify-center rounded-md bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Documentation
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 