'use client';

import { ProtectedRoute } from '@/features/auth';
import { Sidebar } from '@/features/layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-mongodb-dark text-white">
        <Sidebar />
        <main className="ml-16 lg:ml-64 min-h-screen">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 