'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MongoDBLogo } from './MongoDBLogo';

export function Nav() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-mongodb-dark/95 backdrop-blur-sm border-b border-mongodb-dark-400">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center">
            <MongoDBLogo className="text-white" width={120} height={32} />
            <span className="ml-2 text-lg font-bold text-white">
              Developer's Launch Pad
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isLoading ? null : !user ? (
            <a
              href="/api/auth/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-mongodb-green px-4 text-sm font-medium text-mongodb-dark transition-colors hover:bg-mongodb-green-400"
            >
              Sign In
            </a>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-mongodb-green ${
                  pathname.startsWith('/dashboard') 
                    ? 'text-mongodb-green' 
                    : 'text-white'
                }`}
              >
                Dashboard
              </Link>
              <a
                href="/api/auth/logout"
                className="inline-flex h-9 items-center justify-center rounded-md border border-mongodb-green/30 px-4 text-sm font-medium text-white transition-colors hover:bg-mongodb-dark-400 hover:text-mongodb-green"
              >
                Sign Out
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
} 