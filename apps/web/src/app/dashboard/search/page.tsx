'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Search</h1>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your links..."
            className="flex-1 rounded-l-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-r-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Search
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Try semantic queries like &quot;design-system case studies&quot; or &quot;productivity tools&quot;
        </p>
      </form>
      
      {searched && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="mb-4">No results found for &quot;{query}&quot;</p>
          <Link 
            href="/dashboard" 
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
} 