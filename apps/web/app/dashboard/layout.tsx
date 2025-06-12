import React from 'react';
import { requireAuth } from '@/lib/supabase/auth';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-end h-16 px-6 border-b border-border bg-card">
          <Link 
            href="/dashboard/add"
            className="bg-primary hover:bg-primary-hover text-text-primary font-semibold py-2 px-4 rounded-sm text-sm transition-colors"
          >
            + Add Link
          </Link>
        </header>
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 