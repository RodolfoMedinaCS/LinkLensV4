import React from 'react';
import LinkCard from './LinkCard';
import { LinkWithContent } from '../../types/link';

type LinkListProps = {
  links: LinkWithContent[];
};

export default function LinkList({ links }: LinkListProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-focus-border-muted rounded-none">
        <h2 className="text-xl font-medium text-focus-foreground">No links saved yet.</h2>
        <p className="text-focus-foreground-muted mt-2">Use the Chrome Extension to start capturing links.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
} 