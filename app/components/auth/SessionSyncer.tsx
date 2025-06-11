'use client';

import { createBrowserClient } from '@/lib/supabase/client'; // Corrected function name
import { useEffect } from 'react';
import { AuthChangeEvent, Session } from '@supabase/supabase-js'; // Import types

export default function SessionSyncer() {
  useEffect(() => {
    const supabase = createBrowserClient(); // Corrected function call
    const extensionId = process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID; // IMPORTANT: Add this to your .env.local

    if (!extensionId) {
      console.warn('Chrome Extension ID is not set. Session syncing is disabled.');
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => { // Added types
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
        console.log(`Auth event: ${event}. Sending session to extension...`);
        chrome.runtime.sendMessage(
          extensionId,
          { type: 'SYNC_SESSION', session },
          (response) => {
            if (chrome.runtime.lastError) {
              // This error is expected if the extension is not installed or not listening.
              // console.error('Error sending message:', chrome.runtime.lastError.message);
            } else {
              console.log('Session sync message sent successfully.', response);
            }
          }
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null; // This component does not render anything
} 