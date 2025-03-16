import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { UserProvider } from '@/features/auth';
import { Nav, Footer } from '@/features/layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MongoDB Developer\'s Launch Pad',
  description: 'Your launchpad for MongoDB-powered development',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-mongodb-dark text-white min-h-screen flex flex-col`}>
        <UserProvider>
          <Nav />
          <div className="flex-grow pt-16">
            {children}
          </div>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
} 