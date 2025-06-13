'use client';

import React, { useEffect, useState, useRef, createRef } from 'react';
import { LinkCard } from './links/LinkCard';
import { LinkWithContent } from '../../types/link';
import { createBrowserClient } from '../lib/supabase/client';

type LinkListProps = {
  links: LinkWithContent[];
};

export default function LinkList({ links: initialLinks }: LinkListProps) {
  const [links, setLinks] = useState(initialLinks);
  const [focusedLinkId, setFocusedLinkId] = useState<string | null>(null);
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);
  const supabase = createBrowserClient();
  const linkRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Populate refs array
  if (linkRefs.current.length !== links.length) {
    linkRefs.current = Array(links.length).fill(null).map((_, i) => linkRefs.current[i] || createRef());
  }

  const handleDelete = async (linkId: string) => {
    // Optimistically remove the link from the UI
    setLinks(currentLinks => currentLinks.filter(link => link.id !== linkId));

    // Call Supabase to delete the link from the database
    const { error } = await supabase
      .from('links')
      .delete()
      .match({ id: linkId });

    if (error) {
      console.error('Error deleting link:', error);
      // If the delete fails, revert the UI change
      // A more robust solution might involve a toast notification
      setLinks(initialLinks);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocusedLinkId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetId = hoveredLinkId || focusedLinkId;

      // Shortcuts that can work with hover or focus
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        if (!targetId) return;
        e.preventDefault();
        const targetLink = links.find(link => link.id === targetId);
        if (targetLink) {
            navigator.clipboard.writeText(targetLink.url);
            // Optionally: add a toast notification for feedback
        }
        return;
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!targetId) return;
        e.preventDefault();
        handleDelete(targetId);
        return;
      }

      // Navigation should only work with a focused link
      if (!focusedLinkId) return;

      const currentIndex = links.findIndex(link => link.id === focusedLinkId);
      if (currentIndex === -1) return;

      let nextIndex = -1;
      
      const getNumColumns = () => {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
      };
      
      const numColumns = getNumColumns();

      if (e.key === 'ArrowRight') {
        nextIndex = Math.min(currentIndex + 1, links.length - 1);
      } else if (e.key === 'ArrowLeft') {
        nextIndex = Math.max(currentIndex - 1, 0);
      } else if (e.key === 'ArrowDown') {
        nextIndex = Math.min(currentIndex + numColumns, links.length - 1);
      } else if (e.key === 'ArrowUp') {
        nextIndex = Math.max(currentIndex - numColumns, 0);
      }

      if (nextIndex !== -1) {
        e.preventDefault();
        const nextLinkId = links[nextIndex].id;
        setFocusedLinkId(nextLinkId);
        linkRefs.current[nextIndex]?.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [links, focusedLinkId, hoveredLinkId, handleDelete]);

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
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {links.map((link, index) => (
        <LinkCard
            ref={linkRefs.current[index]}
            key={link.id}
            linkId={link.id}
            url={link.url}
            title={link.title}
            aiSummary={link.ai_summary}
            faviconUrl={link.favicon_url}
            status={mapStatus(link.status)}
            onDelete={handleDelete}
            isFocused={focusedLinkId === link.id}
            onFocusRequested={setFocusedLinkId}
            onActionComplete={() => setFocusedLinkId(null)}
            onMouseEnter={() => setHoveredLinkId(link.id)}
            onMouseLeave={() => setHoveredLinkId(null)}
        />
      ))}
    </div>
  );
} 