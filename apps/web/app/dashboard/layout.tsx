import React from 'react';
import { requireAuth } from '@/lib/supabase/auth';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import { ThemeSwitcher } from '../components/theme-switcher';
import { Button } from '../components/ui/button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-white dark:bg-card">
          <div /> {/* This empty div will push the other items to the right */}
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link 
                href="/dashboard/add"
              >
                + Add Link
              </Link>
            </Button>
            <ThemeSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
} 