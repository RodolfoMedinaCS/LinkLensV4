'use client';

import React from 'react';
import Image from 'next/image';
import { LinkWithContent } from '../../types/link';
import { FolderPlus, MoreHorizontal, Trash2 } from 'lucide-react';

interface LinkCardProps {
  link: LinkWithContent;
}

const LinkCard: React.FC<LinkCardProps> = ({ link }) => {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}`;

  return (
    <div className="group relative flex flex-col md:flex-row bg-focus-background border border-focus-border rounded-none overflow-hidden transition-all duration-300 ease-in-out">
      {link.main_image_url && (
        <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0">
          <Image
            src={link.main_image_url}
            alt={link.title || 'Link image'}
            fill={true}
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r"></div>
        </div>
      )}

      <div className="flex flex-col justify-between p-5">
        <div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 relative mr-2 flex-shrink-0">
              <Image
                src={faviconUrl}
                alt={`${link.site_name || 'site'} favicon`}
                width={16}
                height={16}
                className="rounded-sm"
              />
            </div>
            <span className="font-mono text-sm text-focus-foreground-muted truncate">
              {link.site_name || new URL(link.url).hostname}
            </span>
          </div>

          <h3 className="font-sans font-semibold text-lg text-focus-foreground mb-1 leading-tight">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-focus-accent transition-colors duration-200"
            >
              {link.title || 'Untitled Link'}
            </a>
          </h3>

          <p className="font-sans text-sm text-focus-foreground-muted line-clamp-2">
            {link.description || 'No description available.'}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-focus-border-muted/50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <span className="font-mono text-xs text-focus-accent-2">
                    {link.status}
                </span>
                 {link.tags?.map((tag: string) => (
                    <span key={tag} className="font-mono text-xs bg-focus-border text-focus-foreground-muted px-2 py-0.5 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
      </div>

      <div className="absolute top-3 right-3 flex items-center space-x-2 bg-focus-background/80 backdrop-blur-sm border border-focus-border-muted/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button aria-label="Add to folder" className="p-1.5 text-focus-foreground-muted hover:text-focus-accent transition-colors rounded-full">
            <FolderPlus size={16} />
        </button>
        <button aria-label="Delete link" className="p-1.5 text-focus-foreground-muted hover:text-focus-accent transition-colors rounded-full">
            <Trash2 size={16} />
        </button>
        <button aria-label="More options" className="p-1.5 text-focus-foreground-muted hover:text-focus-accent transition-colors rounded-full">
            <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

export default LinkCard; 