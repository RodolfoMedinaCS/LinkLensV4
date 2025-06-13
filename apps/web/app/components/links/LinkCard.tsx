'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import { 
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
    ContextMenuShortcut,
 } from '../ui/context-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { getShortcutKey } from '../../../utils/detectOS';

/**
 * Props for the LinkCard component.
 * Adheres to the "Focus Terminal" theme from @web_design.txt.
 */
interface LinkCardProps {
  linkId: string;
  url: string;
  title?: string | null;
  aiSummary?: string | null;
  faviconUrl?: string | null;
  status?: 'processing' | 'processed' | 'error';
  onDelete: (linkId: string) => void;
  isFocused: boolean;
  onFocusRequested: (linkId: string) => void;
  onActionComplete: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * A card component to display a saved link with different visual states:
 * 'processing', 'processed', and 'error'.
 * Includes animations for state transitions.
 */
export const LinkCard = React.forwardRef<HTMLDivElement, LinkCardProps>(({
  linkId,
  url,
  title,
  aiSummary,
  faviconUrl,
  status = 'processed',
  onDelete,
  isFocused,
  onFocusRequested,
  onActionComplete,
  onMouseEnter,
  onMouseLeave
}, ref) => {
  const domain = new URL(url).hostname;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const ignoreFocusRef = useRef(false);
  const [shortcutKey, setShortcutKey] = useState('⌘');
  const [isTruncated, setIsTruncated] = useState(false);
  const [isFocusable, setIsFocusable] = useState(true);

  useEffect(() => {
    // getShortcutKey relies on `navigator`, so we call it in useEffect.
    setShortcutKey(getShortcutKey());

    // Check for truncation
    if (summaryRef.current) {
        setIsTruncated(summaryRef.current.scrollHeight > summaryRef.current.clientHeight);
    }
  }, [aiSummary]); // Re-check when summary changes

  const handleClick = () => {
    // Programmatically click the hidden link
    linkRef.current?.click();
  };

  const handleFocus = () => {
    if (ignoreFocusRef.current) {
        // This focus event was triggered by the context menu closing.
        // Ignore it and reset the flag.
        ignoreFocusRef.current = false;
        return;
    }
    // This was a user-initiated focus (e.g., tabbing).
    onFocusRequested(linkId);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      linkRef.current?.click();
    }
    // Note: Arrow key handling is now managed by the parent LinkList
  };

  // This useEffect hook runs only on the client, after the component has mounted.
  // This prevents the "document is not defined" error during server-side rendering.
  useEffect(() => {
    const styleId = 'four-line-clamp-style';
    if (document.getElementById(styleId)) {
      return;
    }
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .four-line-clamp {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;  
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const cardBaseClasses = "relative flex flex-col h-full rounded-lg border bg-card p-5 overflow-hidden";

  // State: Processing
  if (status === 'processing') {
    return (
      <div className={cn(cardBaseClasses, "animate-pulse")}>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="flex-grow">
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="text-xs text-accent-foreground">Processing</span>
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
          </div>
        </div>
        <Skeleton className="h-5 w-4/5 rounded-md mb-3" />
        <Skeleton className="h-16 w-full rounded-md" />
        <div className="mt-auto pt-4">
            <p className="text-sm text-muted-foreground truncate">{domain}</p>
        </div>
      </div>
    );
  }

  // State: Error
  if (status === 'error') {
    return (
      <div className={cn(cardBaseClasses, "border-destructive/50")}>
        <div className="flex items-center gap-3 mb-4 text-destructive">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">Failed to process link</p>
        </div>
        <p className="text-sm text-muted-foreground truncate break-all">{url}</p>
      </div>
    );
  }

  // State: Processed
  return (
    <ContextMenu onOpenChange={(open) => {
        if (!open) {
            // The context menu is closing. A programmatic focus event is imminent.
            // Set a flag to ignore this specific, upcoming focus event.
            ignoreFocusRef.current = true;
            onActionComplete();
        }
    }}>
        <ContextMenuTrigger asChild>
            <motion.div
            ref={ref}
            tabIndex={isFocusable ? 0 : -1}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={cn(
                "group",
                cardBaseClasses,
                'cursor-pointer transition-colors',
                'focus:outline-none', // We use custom focus styles
                isFocused 
                    ? 'ring-2 ring-blue-500 border-blue-500' // Focused state
                    : 'border-gray-200 dark:border-border', // Default state
                'hover:border-blue-300 dark:hover:border-blue-500/50', // Hover state
                'will-change-transform backface-hidden'
            )}
            whileHover={{ y: isFocused ? 0 : -2, scale: isFocused ? 1 : 1.01 }}
            >
            <Link 
                ref={linkRef} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="absolute inset-0 z-0" 
                aria-label={`Open link to ${title || domain}`} 
                tabIndex={-1} // Prevent the link itself from being tabbed to
            />
            
            {/* Card Content */}
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    {faviconUrl ? (
                    <img
                        src={faviconUrl}
                        alt={`${domain} favicon`}
                        className="h-5 w-5 object-contain"
                    />
                    ) : (
                    <div className="h-5 w-5 rounded-full bg-muted"></div>
                    )}
                    <p className="text-sm text-gray-500 dark:text-muted-foreground flex-grow truncate">{domain}</p>
                </div>

                <h3 className="font-semibold text-lg text-gray-900 dark:text-foreground mb-3 leading-tight truncate">
                    {title || '[no-title]'}
                </h3>

                {aiSummary && (
                    <div className="relative">
                        <TooltipProvider>
                            <Tooltip open={isTruncated ? undefined : false}>
                                <TooltipTrigger asChild>
                                    <div className="relative">
                                        <Badge
                                            variant="outline"
                                            className="mb-2 border-amber-400/50 text-amber-400 text-xs"
                                        >
                                            AI Summary
                                        </Badge>
                                        <p 
                                            ref={summaryRef} 
                                            className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed four-line-clamp"
                                        >
                                            {aiSummary}
                                        </p>
                                        {isTruncated && <div className="text-fade-out" />}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" align="start" className="max-w-xs prose prose-sm dark:prose-invert">
                                    <p>{aiSummary}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </div>
            </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48" onMouseUp={(e) => e.stopPropagation()}>
          <ContextMenuItem onSelect={() => { window.open(url, '_blank'); onActionComplete(); }}>
            Open Link
            <ContextMenuShortcut>↵</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => { navigator.clipboard.writeText(url); onActionComplete(); }}>
            Copy Link
            <ContextMenuShortcut>{shortcutKey}+C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onSelect={onActionComplete}>
            Move to Folder...
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            className="text-red-500 focus:text-red-500"
            onSelect={() => { onDelete(linkId); onActionComplete(); }}
          >
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});

export default LinkCard; 