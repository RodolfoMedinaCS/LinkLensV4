'use client';

import React, { useState } from 'react';
import { mockLinks } from '@/data/mockLinks';
import LinkCard from '@/components/cards/LinkCard';
import Input from '@/components/ui/Input';
import Tag from '@/components/ui/Tag';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(mockLinks);
  const [searchType, setSearchType] = useState<'semantic' | 'keyword'>('semantic');

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults(mockLinks);
      return;
    }
    
    // Simulate search results
    const filtered = mockLinks.filter(link =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setResults(filtered);
  };

  const popularQueries = [
    'design systems',
    'react performance',
    'ai tools',
    'database patterns',
    'authentication'
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Semantic Search</h1>
          <p className="text-secondary">
            Search your links using natural language queries
          </p>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Try: 'articles about React performance optimization'"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="text-base py-3"
          />
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchType('semantic')}
                className={`px-3 py-1 text-sm border transition-colors ${
                  searchType === 'semantic'
                    ? 'bg-accent/10 text-accent border-accent/20'
                    : 'text-secondary border-border hover:text-primary'
                }`}
              >
                Semantic
              </button>
              <button
                onClick={() => setSearchType('keyword')}
                className={`px-3 py-1 text-sm border transition-colors ${
                  searchType === 'keyword'
                    ? 'bg-accent/10 text-accent border-accent/20'
                    : 'text-secondary border-border hover:text-primary'
                }`}
              >
                Keyword
              </button>
            </div>
            
            <div className="text-sm text-secondary">
              {results.length} results
            </div>
          </div>
        </div>
        
        {!query && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-primary mb-3">Popular Queries</h3>
            <div className="flex flex-wrap gap-2">
              {popularQueries.map((popularQuery) => (
                <button
                  key={popularQuery}
                  onClick={() => handleSearch(popularQuery)}
                  className="text-left"
                >
                  <Tag variant="accent">{popularQuery}</Tag>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {results.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
          
          {query && results.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-secondary">No results found for "{query}"</p>
              <p className="text-secondary text-sm mt-2">
                Try different keywords or check your spelling
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}