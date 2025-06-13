'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { LinkCard } from './links/LinkCard';
import { LinkListItem } from './links/LinkListItem';
import { type LinkWithContent } from '../../types/link';
import { createBrowserClient } from '../lib/supabase/client';
import { type GroupedLinks } from '../../utils/groupLinksByDate';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// --- Main List Component ---

type LinkListProps = {
  links: GroupedLinks;
  viewMode?: 'grid' | 'list';
  density?: 'comfortable' | 'compact';
};

interface VirtualizedLinkListProps extends Omit<LinkListProps, 'links'> {
  links: GroupedLinks;
  handleDelete: (linkId: string) => void;
  handleFocusRequested: (linkId: string) => void;
  handleActionComplete: () => void;
  focusedLinkId: string | null;
  itemVariants: any;
}

const VirtualizedLinkList = ({ 
  links, viewMode, density, handleDelete, handleFocusRequested, handleActionComplete, focusedLinkId, itemVariants 
}: VirtualizedLinkListProps) => {

  const gridClasses = density === 'comfortable'
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4";
  
  // We need to flatten the grouped links into a single array for react-window
  const { items, getItemSize } = useMemo(() => {
    const flattened: any[] = [];
    Object.entries(links).forEach(([groupTitle, groupLinks]) => {
      flattened.push({ type: 'header', title: groupTitle });
      (groupLinks as LinkWithContent[]).forEach(link => {
        flattened.push({ type: 'item', link });
      });
    });
    
    const sizeMap = {
      header: 72, // height for header
      item: 69,   // height for list item
    };

    return {
      items: flattened,
      getItemSize: (index: number) => sizeMap[flattened[index].type as keyof typeof sizeMap] || 0,
    };
  }, [links, viewMode, density]);

  const itemData = useMemo(() => ({
    items,
    props: {
      handleDelete,
      handleFocusRequested,
      handleActionComplete,
      focusedLinkId,
      itemVariants,
      density,
      gridClasses
    }
  }), [items, handleDelete, handleFocusRequested, handleActionComplete, focusedLinkId, itemVariants, density, gridClasses]);

  // The Row component for the list
  const Row = React.memo(({ index, style, data }: any) => {
    const item = data.items[index];
    const { 
      handleDelete, handleFocusRequested, handleActionComplete, 
      focusedLinkId, itemVariants 
    } = data.props;
    
    if (item.type === 'header') {
      return (
        <h2 style={style} className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-2 px-4">
          {item.title}
        </h2>
      );
    }

    const link = item.link;
    return (
      <div style={style} className="px-4 py-1">
        <LinkListItem
          key={link.id} linkId={link.id} url={link.url} title={link.title}
          faviconUrl={link.favicon_url} 
          status={['processing', 'processed', 'error'].includes(link.status) ? link.status as 'processing' | 'processed' | 'error' : 'error'}
          onDelete={handleDelete}
          isFocused={focusedLinkId === link.id} onFocusRequested={handleFocusRequested}
          onActionComplete={handleActionComplete}
          itemVariants={itemVariants}
        />
      </div>
    );
  });
  Row.displayName = 'Row';

  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait">
      {viewMode === 'grid' ? (
        <motion.div
          key="grid"
          className="h-full"
        >
          <div className="space-y-12">
            {Object.entries(links).map(([groupTitle, groupLinks]) => (
              <section key={groupTitle} className="mb-12">
                <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-2">
                  {groupTitle}
                </h2>
                <div className={cn("grid", gridClasses)}>
                  {(groupLinks as LinkWithContent[]).map((link) => (
                    <LinkCard
                      key={link.id}
                      linkId={link.id}
                      url={link.url}
                      title={link.title}
                      faviconUrl={link.favicon_url}
                      aiSummary={link.ai_summary}
                      status={['processing', 'processed', 'error'].includes(link.status) ? (link.status as 'processing' | 'processed' | 'error') : 'error'}
                      onDelete={handleDelete}
                      isFocused={focusedLinkId === link.id}
                      onFocusRequested={handleFocusRequested}
                      onActionComplete={handleActionComplete}
                      itemVariants={itemVariants}
                      density={density}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div key="list" className="h-full">
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={items.length}
                itemSize={getItemSize}
                width={width}
                itemData={itemData}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

export default function LinkList({ links: groupedLinks, viewMode = 'grid', density = 'comfortable' }: LinkListProps) {
  const [links, setLinks] = useState<GroupedLinks>(groupedLinks);
  const [focusedLinkId, setFocusedLinkId] = useState<string | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    setLinks(groupedLinks);
  }, [groupedLinks]);

  const handleDelete = useCallback(async (linkId: string) => {
    const newLinks = { ...links };
    for (const group in newLinks) {
        newLinks[group] = newLinks[group].filter((link: LinkWithContent) => link.id !== linkId);
        if (newLinks[group].length === 0) {
            delete newLinks[group];
        }
    }
    setLinks(newLinks);

    const { error } = await supabase.from('links').delete().match({ id: linkId });
    if (error) {
      console.error('Error deleting link:', error);
      setLinks(groupedLinks); // Revert on error
    }
  }, [groupedLinks, supabase, links]);

  const handleFocusRequested = useCallback((linkId: string) => setFocusedLinkId(linkId), []);
  const handleActionComplete = useCallback(() => setFocusedLinkId(null), []);

  const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
  };

  const allLinksEmpty = Object.keys(links).length === 0;

  if (allLinksEmpty) {
    return (
      <div className="w-full h-full flex items-center justify-center text-center py-20 border-2 border-dashed border-neutral-800 rounded-lg">
        <div>
            <h2 className="text-xl font-medium text-neutral-50">No links saved yet.</h2>
            <p className="text-neutral-400 mt-2">Use the Chrome Extension to start capturing links.</p>
        </div>
      </div>
    );
  }

  return (
    <VirtualizedLinkList
      links={links}
      viewMode={viewMode}
      density={density}
      handleDelete={handleDelete}
      handleFocusRequested={handleFocusRequested}
      handleActionComplete={handleActionComplete}
      focusedLinkId={focusedLinkId}
      itemVariants={itemVariants}
    />
  );
} 