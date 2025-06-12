'use client';

import React from 'react';
import EnhancedLinkCard from '../links/LinkCard';

export default function LinkCardExamples() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Processing State</h2>
        <EnhancedLinkCard 
          url="https://example.com/very-long-article-about-technology" 
          status="processing" 
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Processed State</h2>
        <EnhancedLinkCard 
          url="https://github.com/shadcn/ui" 
          title="shadcn/ui - Beautifully designed components built with Radix UI and Tailwind CSS" 
          aiSummary="A collection of reusable components built using Radix UI and Tailwind CSS. Designed to be accessible, customizable, and open source, this project helps developers build modern, consistent UIs faster." 
          faviconUrl="https://github.com/favicon.ico" 
          status="processed" 
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Error State</h2>
        <EnhancedLinkCard 
          url="https://example.com/broken-link-that-couldnt-be-processed" 
          status="error" 
        />
      </div>
    </div>
  );
} 