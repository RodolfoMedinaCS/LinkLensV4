import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import React from 'react';
import AuthStateListener from './components/auth-state-listener';
import SessionSyncer from '@/components/auth/SessionSyncer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'LinkLens | AI-Powered Bookmark Manager',
  description: 'Organize, summarize, and discover your saved links with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-text-primary`}>
        <AuthStateListener />
        <SessionSyncer />
        {children}
      </body>
    </html>
  );
} 