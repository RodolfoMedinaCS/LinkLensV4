import React from 'react';
import { MockLink } from '@/data/mockLinks';
import Tag from '@/components/ui/Tag';

interface LinkCardProps {
  link: MockLink;
}

export default function LinkCard({ link }: LinkCardProps) {
  return (
    <div className="card p-4 hover:border-accent transition-colors group">
      <div className="flex gap-4">
        {link.imageUrl && (
          <div className="flex-shrink-0">
            <img 
              src={link.imageUrl} 
              alt={link.title}
              className="w-16 h-16 object-cover border border-border"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title}
              </a>
            </h3>
            <span className="text-xs text-secondary font-mono flex-shrink-0">
              {link.source}
            </span>
          </div>
          
          <p className="text-sm text-secondary mb-3 line-clamp-2">
            {link.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {link.tags.slice(0, 3).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
              {link.tags.length > 3 && (
                <Tag>+{link.tags.length - 3}</Tag>
              )}
            </div>
            
            <span className="text-xs text-secondary font-mono">
              {new Date(link.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}