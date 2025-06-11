'use client';

import { useState } from 'react';
import { useAuth } from '../../../../lib/context/auth-context';
import { supabase } from '../../../../lib/supabase/client';
import Link from 'next/link';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Failed to sign out', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      
      {message && (
        <div 
          className={`mb-4 rounded-md p-3 ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h2 className="text-lg font-medium">Account</h2>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-gray-500">Email</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                {loading ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h2 className="text-lg font-medium">Navigation</h2>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard/settings/profile" 
                className="block rounded-md p-2 text-blue-600 hover:bg-gray-50"
              >
                Profile Settings
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/settings/billing" 
                className="block rounded-md p-2 text-blue-600 hover:bg-gray-50"
              >
                Billing
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-red-200 bg-white">
        <div className="border-b border-red-200 bg-red-50 px-4 py-3">
          <h2 className="text-lg font-medium text-red-700">Danger Zone</h2>
        </div>
        <div className="p-4">
          <p className="mb-4 text-sm">
            Permanently delete your account and all your data. This action cannot be undone.
          </p>
          <button
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={() => alert('This feature is not implemented in the demo')}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
} 