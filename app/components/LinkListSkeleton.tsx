import React from 'react';

export const LinkListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border border-border rounded-sm bg-card">
        <div className="w-32 h-24 flex-shrink-0 bg-background/50 rounded-sm hidden md:block animate-pulse"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 bg-background/50 rounded animate-pulse"></div>
          <div className="h-4 w-1/4 bg-background/50 rounded animate-pulse"></div>
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-background/50 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-background/50 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <div className="h-5 w-16 bg-background/50 rounded-sm animate-pulse"></div>
            <div className="h-5 w-20 bg-background/50 rounded-sm animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
); 