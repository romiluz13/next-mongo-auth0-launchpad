import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          'animate-spin rounded-full border-t-transparent border-emerald-500',
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-mongodb-dark/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="bg-mongodb-dark-500 border border-mongodb-dark-400 rounded-lg p-8 flex flex-col items-center space-y-4 max-w-md mx-auto">
        <Spinner size="lg" />
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  );
} 