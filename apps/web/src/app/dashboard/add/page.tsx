'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../../lib/context/auth-context';

export default function AddLink() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ text: 'You must be logged in to add links', type: 'error' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      // This would normally save to Supabase
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ text: 'Link added successfully!', type: 'success' });
      setUrl('');
      setTitle('');
      setTags('');
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Failed to add link', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Link</h1>
        <Link 
          href="/dashboard" 
          className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          Cancel
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
      
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <label htmlFor="url" className="mb-1 block text-sm font-medium">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Optional title (will be auto-detected if empty)"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            If left empty, we&apos;ll attempt to extract the title from the page
          </p>
        </div>
        
        <div>
          <label htmlFor="tags" className="mb-1 block text-sm font-medium">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags separated by commas"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            AI will also suggest tags based on content
          </p>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Link'}
          </button>
        </div>
      </form>
    </div>
  );
} 