'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MongoDBLogo } from './MongoDBLogo';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function Nav() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-mongodb-dark/90 backdrop-blur-md shadow-md' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center group">
              <div className="relative w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110">
                <MongoDBLogo width={28} height={28} />
              </div>
              <span className="ml-3 text-lg font-bold text-white">
                Developer's Launch Pad
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/ui-showcase"
              className={`text-sm font-medium transition-colors hover:text-emerald-400 relative ${
                pathname === '/ui-showcase' 
                  ? 'text-emerald-400' 
                  : 'text-white'
              }`}
            >
              {pathname === '/ui-showcase' && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"></span>
              )}
              UI Components
            </Link>
            
            {isLoading ? null : !user ? (
              <Button 
                variant="default" 
                size="sm" 
                asChild
                className="bg-emerald-500 hover:bg-emerald-400 text-mongodb-dark font-medium"
              >
                <a href="/api/auth/login">
                  Sign In
                </a>
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-emerald-400 relative ${
                    pathname.startsWith('/dashboard') 
                      ? 'text-emerald-400' 
                      : 'text-white'
                  }`}
                >
                  {pathname.startsWith('/dashboard') && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"></span>
                  )}
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-emerald-500/30 hover:bg-mongodb-dark-400"
                >
                  <a href="/api/auth/logout">
                    Sign Out
                  </a>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
      
      {/* Subtle highlight line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
    </header>
  );
} 