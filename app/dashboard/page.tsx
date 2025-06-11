import React, { Suspense } from 'react';
import LinkList from '../components/LinkList';
import { LinkListSkeleton } from '../components/LinkListSkeleton';
import { createServerClient } from '../lib/supabase/server';
import { LinkWithContent } from '../../types/link';

async function getLinks(): Promise<LinkWithContent[]> {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('links')
    .select('*, link_content(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching links:', error);
    return [];
  }
  return data || [];
}


export default async function DashboardPage() {
  const links = await getLinks();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">All Links</h1>
      <p className="text-text-secondary mb-8">A complete list of all your saved links.</p>
      
      <Suspense fallback={<LinkListSkeleton />}>
        <LinkList links={links} />
      </Suspense>
    </div>
  );
} 