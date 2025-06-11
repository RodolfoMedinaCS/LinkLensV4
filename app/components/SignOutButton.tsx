"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '../../lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <button 
      className="bg-transparent border border-border hover:bg-card text-text-primary px-4 py-2 rounded-sm transition-colors"
      onClick={handleSignOut}
    >
      Sign Out
    </button>
  );
} 