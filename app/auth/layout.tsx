import React from 'react';
import type { Metadata } from 'next';
import '../globals.css';

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
    <main className="min-h-screen">
      {children}
    </main>
  );
} 