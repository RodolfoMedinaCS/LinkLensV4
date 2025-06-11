import { requireAuth } from '@/lib/supabase/auth';
import Link from 'next/link';
import SignOutButton from '../components/SignOutButton';

export default async function Dashboard() {
  // This will redirect to login if not authenticated
  const session = await requireAuth();
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">LinkLens Dashboard</h1>
          
          <SignOutButton />
        </div>
        
        <div className="bg-card border border-border p-6 rounded-sm">
          <p className="text-white mb-4">Welcome, {session.user.email}</p>
          <p className="text-muted mb-6">Your AI-powered bookmark manager is ready.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/dashboard/add" 
              className="bg-background border border-border hover:border-primary p-4 rounded-sm text-center transition-colors"
            >
              Add New Link
            </Link>
            <Link 
              href="/dashboard/folders" 
              className="bg-background border border-border hover:border-primary p-4 rounded-sm text-center transition-colors"
            >
              Manage Folders
            </Link>
            <Link 
              href="/dashboard/clusters" 
              className="bg-background border border-border hover:border-primary p-4 rounded-sm text-center transition-colors"
            >
              View AI Clusters
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 