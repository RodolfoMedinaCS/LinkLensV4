'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Failed to update profile', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <Link 
          href="/dashboard/settings" 
          className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          Back to Settings
        </Link>
      </div>
      
      {message && (
        <div 
          className={`mb-4 rounded-md p-3 ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gray-200"></div>
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                Upload Image
              </button>
            </div>
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium">
              Email Preferences
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="digest-email"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="digest-email" className="ml-2 text-sm">
                  Receive weekly digest emails
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="notification-email"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="notification-email" className="ml-2 text-sm">
                  Receive notification emails
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 