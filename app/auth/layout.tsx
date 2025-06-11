import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Authentication | LinkLens',
  description: 'Sign in or sign up for LinkLens, your AI-powered bookmark manager',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#0D1117] text-white`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
} 