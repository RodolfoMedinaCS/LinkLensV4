'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/context/auth-context';
import { useEffect } from 'react';

function Sidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };
  
  return (
    <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-6 text-xl font-bold">LinkLens</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link 
              href="/dashboard" 
              className={`block rounded-md p-2 ${
                isActive('/dashboard') && !isActive('/dashboard/clusters') && 
                !isActive('/dashboard/folders') && !isActive('/dashboard/search') && 
                !isActive('/dashboard/add') && !isActive('/dashboard/settings')
                  ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Links
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/clusters" 
              className={`block rounded-md p-2 ${
                isActive('/dashboard/clusters')
                  ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Smart Clusters
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/folders" 
              className={`block rounded-md p-2 ${
                isActive('/dashboard/folders')
                  ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Folders
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/search" 
              className={`block rounded-md p-2 ${
                isActive('/dashboard/search')
                  ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Search
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/add" 
              className={`block rounded-md p-2 ${
                isActive('/dashboard/add')
                  ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Add Link
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/settings" 
              className={`block rounded-md p-2 ${
                isActive('/dashboard/settings')
                  ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/auth/login';
    }
  }, [user, isLoading]);
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
} 