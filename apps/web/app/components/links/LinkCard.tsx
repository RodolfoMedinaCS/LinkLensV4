'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  status: 'processing' | 'processed' | 'error';
  onDelete: (linkId: string) => void;
  isFocused: boolean;
  onFocusRequested: (linkId: string) => void;
  onActionComplete: () => void;
  itemVariants: any;
  isScrolling?: boolean;
  density?: 'comfortable' | 'compact';
}

/**
 * A card component to display a saved link with different visual states:
 * 'processing', 'processed', and 'error'.
 * Includes animations for state transitions.
 */
export const LinkCard = React.memo(React.forwardRef<HTMLDivElement, LinkCardProps>(({
  linkId,
  url,
  title,
  aiSummary,
  faviconUrl,
  status,
  onDelete,
  isFocused,
  onFocusRequested,
  onActionComplete,
  itemVariants,
  isScrolling = false,
  density = 'comfortable',
}, ref) => {
  const domain = new URL(url).hostname;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const ignoreFocusRef = useRef(false);
  const [shortcutKey, setShortcutKey] = useState('⌘');
  const [isFocusable, setIsFocusable] = useState(true);

  useEffect(() => {
    // getShortcutKey relies on `navigator`, so we call it in useEffect.
    setShortcutKey(getShortcutKey());
  }, []); // Re-check when summary changes

  const handleClick = () => {
    // Programmatically click the hidden link
    linkRef.current?.click();
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (ignoreFocusRef.current) {
        // This focus event was triggered by the context menu closing.
        // Ignore it, blur the element to prevent visual artifacts, and reset the flag.
        ignoreFocusRef.current = false;
        e.currentTarget.blur();
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

  const renderSummaryContent = () => {
    if (status === 'processing') {
      return (
        <motion.div key="processing" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          <Badge variant="summaryProcessing" className="mb-2">Processing...</Badge>
        </motion.div>
      );
    }
    if (status === 'error') {
      return (
        <motion.div key="error">
          <Badge variant="summaryError" className="mb-2">Error</Badge>
          <p className="text-red-500 text-sm">Failed to generate summary.</p>
        </motion.div>
      );
    }
    if (status === 'processed' && aiSummary) {
      return (
        <motion.div key="processed" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
          <Badge variant="summary" className="mb-2">
            AI Summary
          </Badge>
          <p ref={summaryRef} className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed line-clamp-4">
            {aiSummary}
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const cardBaseClasses = "relative flex flex-col h-full rounded-lg border bg-card p-5";
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.1 } }
  };

  // State: Processing
  if (status === 'processing') {
    return (
      <div className={cn(cardBaseClasses, "animate-pulse")}>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="flex-grow">
            <Skeleton className="h-4 w-1/w-3" />
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
        if (open) {
            // Menu is opening, ensure the card is marked as focused.
            onFocusRequested(linkId);
        } else {
            // The context menu is closing. A programmatic focus event is imminent.
            // Set a flag to ignore this specific, upcoming focus event.
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
            tabIndex={isFocusable ? 0 : -1}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className={cn(
                "group",
                cardBaseClasses,
                'cursor-pointer',
                'focus:outline-none',
                !isScrolling && 'transition-all duration-200 ease-out',
                'will-change-transform transform-gpu',
                isFocused 
                    ? 'ring-2 ring-blue-500 border-blue-500'
                    : 'border-gray-200 dark:border-border',
                !isScrolling && 'hover:-translate-y-[2px] hover:border-blue-500/30',
                !isScrolling && 'hover:bg-slate-50',
                !isScrolling && 'dark:hover:bg-neutral-800/30'
            )}
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
            
            <motion.div 
                layout="position"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.1 } }} 
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="relative z-10 flex flex-col h-full"
            >
                {/* Header */}
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
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-foreground leading-tight truncate flex-grow">
                        {title || '[no-title]'}
                    </h3>
                </div>

                {/* AI Summary Section */}
                <div className="mb-4 min-h-[68px]">
                    <AnimatePresence mode="wait">
                        {renderSummaryContent()}
                    </AnimatePresence>
                </div>
                
                {/* Footer - Domain */}
                <div className="mt-auto pt-4">
                  <p className="text-sm text-muted-foreground truncate">{domain}</p>
                </div>
            </motion.div>
            </motion.div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64" onFocusOutside={(e) => e.preventDefault()}>
            <ContextMenuItem inset onClick={() => linkRef.current?.click()}>
                Open Link in New Tab
            </ContextMenuItem>
            <ContextMenuItem inset onClick={() => navigator.clipboard.writeText(url)}>
                Copy Link
                <ContextMenuShortcut>{shortcutKey}C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem inset className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20" onClick={() => onDelete(linkId)}>
                Delete
                <ContextMenuShortcut>Delete</ContextMenuShortcut>
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
  );
}));
LinkCard.displayName = 'LinkCard';

export default LinkCard; 