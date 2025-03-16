import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { UserProvider } from '@/features/auth';
import { Nav, Footer } from '@/features/layout';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MongoDB Developer\'s Launch Pad',
  description: 'The ultimate AI-optimized template for building MongoDB applications. Created for israai.club - Israel\'s first AI coders social network.',
  icons: {
    icon: '/favicon.ico',
  },
  authors: [
    {
      name: 'israai.club',
      url: 'https://israai.club',
    },
  ],
  creator: 'israai.club',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Credit: Created for israai.club - Israel's first AI coders social network */}
        <meta name="generator" content="israai.club - Israel's first AI coders social network" />
      </head>
      <body className={`${inter.className} bg-mongodb-dark text-white min-h-screen flex flex-col`}>
        <UserProvider>
          <Nav />
          <div className="flex-grow pt-16">
            {children}
          </div>
          <Footer />
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
} 