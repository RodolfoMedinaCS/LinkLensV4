"use client";

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function ExtensionCallback() {
  const [message, setMessage] = useState('Authenticating...');
  
  // NOTE: In a production environment, you should get this from your build process
  // or have a way for the extension to provide it.
  const EXTENSION_ID = 'YOUR_EXTENSION_ID_HERE';

  useEffect(() => {
    const supabase = createBrowserClient();
    
    const sendSessionToExtension = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        if (chrome && chrome.runtime) {
          chrome.runtime.sendMessage(EXTENSION_ID, {
            type: 'AUTH_SESSION',
            payload: data.session
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending message:', chrome.runtime.lastError.message);
              setMessage('Could not connect to the LinkLens extension. Please ensure it is installed and enabled.');
            } else {
              setMessage('Authentication successful! You can now close this page and use the extension.');
              // Optional: Automatically close the window
              // setTimeout(() => window.close(), 2000);
            }
          });
        } else {
          setMessage('This page is for authenticating the LinkLens Chrome extension. Please open it from the extension.');
        }
      } else {
        setMessage('No active session found. Please log in first.');
      }
    };

    sendSessionToExtension();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>LinkLens Authentication</h1>
      <p>{message}</p>
    </div>
  );
} 