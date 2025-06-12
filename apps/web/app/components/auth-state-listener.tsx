'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '../../lib/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

// ----------------------------------------------------------------
// IMPORTANT: Replace this placeholder with your actual extension ID
// You can find it in Chrome by navigating to chrome://extensions
// ----------------------------------------------------------------
const YOUR_EXTENSION_ID = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'; 

export default function AuthStateListener() {
  const supabase = createBrowserClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (typeof chrome !== 'undefined' && chrome.runtime && YOUR_EXTENSION_ID) {
        chrome.runtime.sendMessage(YOUR_EXTENSION_ID, {
          event, // e.g., 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED'
          session
        }, (response) => {
          if (chrome.runtime.lastError) {
            // This will fail if the extension is not installed or the ID is wrong.
            // console.log("Could not establish connection. Is the extension installed?");
          }
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  return null;
} 