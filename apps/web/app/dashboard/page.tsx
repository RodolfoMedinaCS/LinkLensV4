import React, { Suspense } from 'react';
import { createSupabaseServerClient } from '../lib/supabase/server';
import { type LinkWithContent } from '../../types/link';
import { LinkListSkeleton } from '../components/LinkListSkeleton';
import DashboardClient from '../components/DashboardClient';

const PAGE_SIZE = 24;

type SortValue = 'date-newest' | 'date-oldest' | 'title-asc';

async function getLinks(page = 1, sort: SortValue = 'date-newest'): Promise<{ links: LinkWithContent[], totalCount: number }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { links: [], totalCount: 0 };

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('links')
    .select('id, user_id, created_at, url, title, description, main_image_url:image_url, site_name, lang, favicon_url, status, ai_summary, link_content(*)', { count: 'exact' })
    .eq('user_id', user.id);

  switch (sort) {
    case 'date-oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'title-asc':
      query = query.order('title', { ascending: true });
      break;
    case 'date-newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error('Error fetching links:', error);
    return { links: [], totalCount: 0 };
  }
  return { links: data || [], totalCount: count || 0 };
}


export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1;
  const sort = (searchParams?.sort as SortValue) || 'date-newest';
  const { links, totalCount } = await getLinks(page, sort);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="h-full">
      <Suspense fallback={<LinkListSkeleton />}>
        <DashboardClient initialLinks={links} totalPages={totalPages} currentPage={page} totalCount={totalCount} />
      </Suspense>
    </div>
  );
} 