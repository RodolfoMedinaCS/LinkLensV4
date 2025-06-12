'use client';

import React, { useEffect, useState } from 'react';
import { EnhancedLinkCard } from './links/LinkCard';
import { LinkWithContent } from '../../types/link';
import { createBrowserClient } from '../lib/supabase/client';

type LinkListProps = {
  links: LinkWithContent[];
};

export default function LinkList({ links: initialLinks }: LinkListProps) {
  const [links, setLinks] = useState(initialLinks);
  const supabase = createBrowserClient();

  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  useEffect(() => {
    const channel = supabase
      .channel('links-follow-up')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'links',
        },
        (payload) => {
          setLinks((currentLinks) =>
            currentLinks.map((link) =>
              link.id === (payload.new as LinkWithContent).id
                ? (payload.new as LinkWithContent)
                : link
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (links.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-neutral-800 rounded-lg">
        <h2 className="text-xl font-medium text-neutral-50">No links saved yet.</h2>
        <p className="text-neutral-400 mt-2">Use the Chrome Extension to start capturing links.</p>
      </div>
    );
  }

  // Helper function to map database status to component status
  const mapStatus = (status: "pending" | "processing" | "processed" | "failed"): 'processing' | 'processed' | 'error' => {
    switch (status) {
        case 'pending':
        case 'processing':
            return 'processing';
        case 'processed':
            return 'processed';
        case 'failed':
        default:
            return 'error';
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {links.map((link) => (
        <EnhancedLinkCard
            key={link.id}
            url={link.url}
            title={link.title}
            aiSummary={link.ai_summary}
            faviconUrl={link.favicon_url}
            status={mapStatus(link.status)}
        />
      ))}
    </div>
  );
} 