'use client';

import React, { useState } from 'react';
import { mockLinks } from '@/data/mockLinks';
import LinkCard from '@/components/cards/LinkCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLinks, setFilteredLinks] = useState(mockLinks);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredLinks(mockLinks);
      return;
    }
    
    const filtered = mockLinks.filter(link =>
      link.title.toLowerCase().includes(query.toLowerCase()) ||
      link.summary.toLowerCase().includes(query.toLowerCase()) ||
      link.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredLinks(filtered);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">All Links</h1>
            <p className="text-secondary">
              {filteredLinks.length} of {mockLinks.length} links
            </p>
          </div>
          
          <Button>
            + Add Link
          </Button>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Search links, tags, or content..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="space-y-4">
          {filteredLinks.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
          
          {filteredLinks.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-secondary">No links found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}