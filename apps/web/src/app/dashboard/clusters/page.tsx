'use client';

import Link from 'next/link';

export default function Clusters() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Smart Clusters</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <p className="mb-4">AI-powered clusters will appear here once you have saved enough links.</p>
        <Link 
          href="/dashboard" 
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
} 