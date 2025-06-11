"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const settingsLinks = [
    { name: 'Profile', href: '/dashboard/settings/profile' },
    { name: 'Billing', href: '/dashboard/settings/billing' },
];

export default function SettingsNav() {
    const pathname = usePathname();

    return (
        <nav className="flex space-x-2 border-b border-border mb-8">
            {settingsLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`px-3 py-2 text-sm font-medium rounded-t-sm transition-colors ${
                            isActive
                                ? 'border-b-2 border-primary text-text-primary'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
} 