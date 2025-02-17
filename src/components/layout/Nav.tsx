'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Nav() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            AI Developer's Launch Pad
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isLoading ? null : !user ? (
            <a
              href="/api/auth/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Sign In
            </a>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <a
                href="/api/auth/logout"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
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