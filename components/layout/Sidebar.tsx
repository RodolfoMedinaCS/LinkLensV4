'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'All Links', href: '/dashboard', icon: '◉' },
  { name: 'Clusters', href: '/dashboard/clusters', icon: '◈' },
  { name: 'Search', href: '/dashboard/search', icon: '◎' },
  { name: 'Settings', href: '/dashboard/settings', icon: '◐' },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary font-mono">LinkLens</h1>
        <p className="text-xs text-secondary mt-1">AI-Powered Bookmarks</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors border ${
                    isActive
                      ? 'bg-accent/10 text-accent border-accent/20'
                      : 'text-secondary hover:text-primary hover:bg-background border-transparent'
                  }`}
                >
                  <span className="font-mono text-base">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-accent/20 border border-accent/40 flex items-center justify-center">
            <span className="text-accent font-mono text-sm">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">User</p>
            <p className="text-xs text-secondary">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}