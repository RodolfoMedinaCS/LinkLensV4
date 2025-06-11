'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/context/auth-context';
import Link from 'next/link';

// Define a type for link objects
interface LinkItem {
  id: string;
  title: string;
  url: string;
  summary?: string;
  tags?: string[];
  created_at?: string;
}

// Placeholder link card component
function LinkCard({ link }: { link: LinkItem }) {
  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-1 text-lg font-semibold">
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {link.title}
        </a>
      </h3>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{link.url}</p>
      <p className="text-sm">{link.summary || 'No summary available'}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {link.tags?.map((tag: string) => (
          <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [fetchingLinks, setFetchingLinks] = useState(true);

  // Fetch links (placeholder data for now)
  useEffect(() => {
    async function fetchLinks() {
      try {
        // This would normally fetch from Supabase, but we'll use placeholder data
        // Uncomment the Supabase query when the links table is created
        
        /*
        import { supabase } from '../../../lib/supabase/client';
        
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setLinks(data || []);
        */
        
        // Placeholder data
        setLinks([
          {
            id: '1',
            title: 'Introduction to Next.js',
            url: 'https://nextjs.org/docs',
            summary: 'Learn the basics of Next.js, the React framework for production.',
            tags: ['react', 'nextjs', 'web-development']
          },
          {
            id: '2',
            title: 'Supabase Documentation',
            url: 'https://supabase.com/docs',
            summary: 'Supabase is an open source Firebase alternative with a PostgreSQL database at its core.',
            tags: ['supabase', 'database', 'backend']
          },
          {
            id: '3',
            title: 'Tailwind CSS',
            url: 'https://tailwindcss.com',
            summary: 'A utility-first CSS framework for rapidly building custom user interfaces.',
            tags: ['css', 'design', 'frontend']
          }
        ]);
      } catch (error) {
        console.error('Error fetching links:', error);
      } finally {
        setFetchingLinks(false);
      }
    }

    if (user) {
      fetchLinks();
    }
  }, [user]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Links</h1>
        <Link 
          href="/dashboard/add" 
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add New Link
        </Link>
      </div>
      
      {fetchingLinks ? (
        <div className="mt-8 text-center">Loading links...</div>
      ) : links.length === 0 ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-4">You haven&apos;t saved any links yet.</p>
          <Link 
            href="/dashboard/add" 
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add Your First Link
          </Link>
        </div>
      ) : (
        <div>
          {links.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      )}
    </div>
  );
} 