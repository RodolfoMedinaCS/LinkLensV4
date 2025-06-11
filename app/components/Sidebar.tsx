"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createBrowserClient } from '../../lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import SignOutButton from './SignOutButton';

const navLinks = [
    { name: 'All Links', href: '/dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> },
    { name: 'Smart Clusters', href: '/dashboard/clusters', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-2 19.5v-1.5a8 8 0 1 1 4 0v1.5A10 10 0 0 0 12 2Z"/><path d="M12 13a2.5 2.5 0 0 0 2.5-2.5c0-.98-.5-2.5-2.5-2.5s-2.5 1.52-2.5 2.5A2.5 2.5 0 0 0 12 13Z"/><path d="M12 13v1"/><path d="M12 18v2"/><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><path d="m6.34 17.66-1.41 1.41"/></svg> },
    { name: 'Folders', href: '/dashboard/folders', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg> },
    { name: 'Search', href: '/dashboard/search', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const supabase = createBrowserClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        fetchUser();
    }, [supabase.auth]);


    const getInitials = (email: string | undefined) => {
        if (!email) return '?';
        const parts = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').split(' ');
        if (parts.length > 1 && parts[1]) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return email.substring(0, 2).toUpperCase();
    }

    return (
        <aside className="w-64 flex-shrink-0 border-r border-border flex flex-col bg-card">
            <div className="h-16 flex items-center px-6">
                <Link href="/dashboard" className="font-bold text-lg text-text-primary flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
                    LinkLens
                </Link>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-primary text-text-primary'
                                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                            }`}
                        >
                           <span className="w-6 h-6">{link.icon}</span>
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="px-4 py-4 border-t border-border mt-auto">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center font-bold text-primary">
                        {getInitials(user?.email)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{user?.email}</p>
                        <Link href="/dashboard/settings" className="text-xs text-text-secondary hover:text-primary transition-colors">
                            Settings
                        </Link>
                    </div>
                </div>
                <SignOutButton />
            </div>
        </aside>
    );
} 