'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CogIcon, 
  HomeIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  KeyIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import { MongoDBLogo } from './MongoDBLogo';

const menuItems = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Team', href: '/dashboard/team', icon: UsersIcon },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: KeyIcon },
  { name: 'Documentation', href: '/dashboard/docs', icon: DocumentTextIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} min-h-screen bg-mongodb-dark text-white transition-all duration-300 fixed left-0 top-0 z-40`}>
      <div className="flex items-center justify-between p-4 border-b border-mongodb-dark-400">
        {!collapsed && (
          <div className="flex items-center">
            <MongoDBLogo className="text-white" width={100} height={26} />
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-mongodb-dark-400 text-mongodb-gray-300"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 transition-colors
                ${isActive ? 'bg-mongodb-green text-mongodb-dark font-medium' : 'hover:bg-mongodb-dark-400'}
                ${collapsed ? 'justify-center' : 'space-x-3'}
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-mongodb-dark' : ''}`} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4 p-3 rounded-md bg-mongodb-dark-400 text-xs text-mongodb-gray-300">
          <div className="flex items-center space-x-2">
            <CommandLineIcon className="w-4 h-4" />
            <span>Developer's Launch Pad</span>
          </div>
          <div className="mt-1 text-mongodb-gray-400">v1.0.0</div>
        </div>
      )}
    </div>
  );
} 