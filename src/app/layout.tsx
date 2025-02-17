import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from '@/components/session-provider';
import { Nav } from '@/components/layout/Nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Developer\'s Launch Pad',
  description: 'Your launchpad for AI-powered development',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SessionProvider>
          <Nav />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
} 