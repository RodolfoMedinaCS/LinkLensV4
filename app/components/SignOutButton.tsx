"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <button 
      className="bg-card hover:bg-border text-white px-4 py-2 rounded-sm"
      onClick={handleSignOut}
    >
      Sign Out
    </button>
  );
} 