'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// UI Components from shadcn/ui
import { Skeleton } from '../ui/skeleton';
import { Badge } from "../ui/badge";

/**
 * Props for the LinkCard component.
 * Adheres to the "Focus Terminal" theme from @web_design.txt.
 */
interface LinkCardProps {
  url: string;
  title?: string | null;
  aiSummary?: string | null;
  faviconUrl?: string | null;
  status: 'processing' | 'processed' | 'error';
}

/**
 * A card component to display a saved link with different visual states:
 * 'processing', 'processed', and 'error'.
 * Includes animations for state transitions.
 */
export const EnhancedLinkCard: React.FC<LinkCardProps> = ({
  url,
  title,
  aiSummary,
  faviconUrl,
  status,
}) => {
  const domain = new URL(url).hostname;

  // This useEffect hook runs only on the client, after the component has mounted.
  // This prevents the "document is not defined" error during server-side rendering.
  useEffect(() => {
    const styleId = 'three-line-clamp-style';
    if (document.getElementById(styleId)) {
        return;
    }
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .three-line-clamp {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const cardBaseClasses = "relative flex flex-col h-full rounded-lg border border-neutral-800 bg-neutral-900 p-5 overflow-hidden";

  // State: Processing
  if (status === 'processing') {
    return (
      <div className={cn(cardBaseClasses, "animate-pulse")}>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-5 w-5 rounded-full bg-neutral-700" />
          <div className="flex-grow">
            <Skeleton className="h-4 w-1/3 bg-neutral-700" />
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="text-xs text-amber-400">Processing</span>
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
          </div>
        </div>
        <Skeleton className="h-5 w-4/5 rounded-md bg-neutral-700 mb-3" />
        <Skeleton className="h-16 w-full rounded-md bg-neutral-700" />
        <div className="mt-auto pt-4">
            <p className="text-sm text-neutral-500 truncate">{domain}</p>
        </div>
      </div>
    );
  }

  // State: Error
  if (status === 'error') {
    return (
      <div className={cn(cardBaseClasses, "border-red-500/50")}>
        <div className="flex items-center gap-3 mb-4 text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">Failed to process link</p>
        </div>
        <p className="text-sm text-neutral-400 truncate break-all">{url}</p>
      </div>
    );
  }

  // State: Processed
  return (
    <div className={cardBaseClasses}>
       <div className="flex items-center gap-3 mb-4">
          {faviconUrl ? (
            <img src={faviconUrl} alt={`${domain} favicon`} className="h-5 w-5 object-contain" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-neutral-700"></div>
          )}
          <p className="text-sm text-neutral-400 flex-grow truncate">{domain}</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <h3 className="font-semibold text-lg text-neutral-50 mb-3 leading-tight truncate">
          {title || "[no-title]"}
        </h3>
      </motion.div>

      {aiSummary && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Badge variant="outline" className="mb-2 border-amber-400/50 text-amber-400 text-xs">AI Summary</Badge>
            <p className="text-neutral-400 text-sm leading-relaxed three-line-clamp">
                {aiSummary}
            </p>
         </motion.div>
      )}
    </div>
  );
};

export default EnhancedLinkCard; 