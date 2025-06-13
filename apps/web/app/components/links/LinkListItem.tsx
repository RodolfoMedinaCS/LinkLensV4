'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { 
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
    ContextMenuShortcut,
 } from '../ui/context-menu';
import { getShortcutKey } from '../../../utils/detectOS';

// Minimal version of LinkCardProps for the list item
interface LinkListItemProps {
  linkId: string;
  url: string;
  title?: string | null;
  faviconUrl?: string | null;
  status: 'processing' | 'processed' | 'error';
  onDelete: (linkId: string) => void;
  isFocused: boolean;
  onFocusRequested: (linkId: string) => void;
  onActionComplete: () => void;
  itemVariants: any;
  isScrolling?: boolean;
}

export const LinkListItem = React.memo(React.forwardRef<HTMLDivElement, LinkListItemProps>(({
  linkId,
  url,
  title,
  faviconUrl,
  status,
  onDelete,
  isFocused,
  onFocusRequested,
  onActionComplete,
  itemVariants,
  isScrolling = false,
}, ref) => {
  const domain = new URL(url).hostname;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const ignoreFocusRef = useRef(false);
  const [shortcutKey, setShortcutKey] = useState('⌘');

  useEffect(() => {
    setShortcutKey(getShortcutKey());
  }, []);
  
  const handleClick = () => linkRef.current?.click();

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (ignoreFocusRef.current) {
        ignoreFocusRef.current = false;
        e.currentTarget.blur();
        return;
    }
    onFocusRequested(linkId);
  }
  
  const badgeText = status === 'processing' ? 'Processing...' : status === 'error' ? 'Error' : 'Processed';
  const badgeVariant = status === 'processing' ? 'summaryProcessing' : status === 'error' ? 'summaryError' : 'summary';

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.1 } }
  };

  return (
    <ContextMenu onOpenChange={(open) => {
        if (open) onFocusRequested(linkId);
        else {
            ignoreFocusRef.current = true;
            onActionComplete();
        }
    }}>
      <ContextMenuTrigger asChild>
        <motion.div
          ref={ref}
          layout
          layoutId={linkId}
          variants={itemVariants}
          onClick={handleClick}
          onFocus={handleFocus}
          className={cn(
            "group",
            "flex items-center w-full p-3 rounded-lg border bg-card gap-4",
            !isScrolling && 'transition-colors',
            'focus:outline-none', 
            isFocused 
                ? 'ring-2 ring-blue-500 border-blue-500' 
                : 'border-gray-200 dark:border-border', 
            !isScrolling && 'hover:bg-slate-50 dark:hover:bg-neutral-800/30'
          )}
        >
          <Link ref={linkRef} href={url} target="_blank" rel="noopener noreferrer" className="hidden" />
          
          <motion.div 
            layout="position"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.1 } }} 
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="flex items-center w-full gap-4"
          >
            {faviconUrl ? (
              <img src={faviconUrl} alt={`${domain} favicon`} className="h-5 w-5 object-contain flex-shrink-0" />
            ) : (
              <div className="h-5 w-5 rounded-full bg-muted flex-shrink-0"></div>
            )}

            <h3 className="font-medium text-sm text-gray-900 dark:text-foreground truncate flex-grow">
              {title || url}
            </h3>

            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
               <Badge variant={badgeVariant as any} className="capitalize">{badgeText}</Badge>
               <p className="text-xs text-muted-foreground w-28 truncate text-right">{domain}</p>
            </div>
          </motion.div>
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {/* Simplified context menu for list item */}
        <ContextMenuItem inset onClick={() => linkRef.current?.click()}>Open Link</ContextMenuItem>
        <ContextMenuItem inset onClick={() => navigator.clipboard.writeText(url)}>
            Copy Link <ContextMenuShortcut>{shortcutKey}C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset className="text-red-600" onClick={() => onDelete(linkId)}>
            Delete <ContextMenuShortcut>Delete</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}));

LinkListItem.displayName = 'LinkListItem'; 