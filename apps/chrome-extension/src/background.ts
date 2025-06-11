// This is a simplified background script with no external imports

// Listen for messages from the web app
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  // The web-app now sends a single message type 'SYNC_SESSION'
  if (request.type === 'SYNC_SESSION') {
    const { session } = request;
    console.log('Received SYNC_SESSION message:', session);

    const handleSession = async (sessionData: any) => {
      try {
        if (sessionData) {
          // Store session in chrome.storage.local
          await chrome.storage.local.set({ session: sessionData });
          console.log('Extension session has been set and stored.');
          sendResponse({ success: true });
        } else {
          // Clear stored session on logout
          await chrome.storage.local.remove('session');
          console.log('Extension session has been cleared.');
          sendResponse({ success: true });
        }
      } catch (err) {
        console.error('Error handling session:', err);
        sendResponse({ success: false, error: String(err) });
      }
    };

    handleSession(session);
    return true; // Indicates we will send a response asynchronously
  }
});

// Listen for messages from our own popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveLink') {
    chrome.storage.local.get('session', ({ session }) => {
      if (session?.access_token) {
        // Updated API endpoint for local development
        fetch('http://localhost:3000/api/links/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ url: request.url })
        })
        .then(res => {
          if (!res.ok) {
            // Attempt to read error body
            return res.json().catch(() => ({ error: 'Request failed with status: ' + res.status }));
          }
          return res.json();
        })
        .then(data => {
          if (data.error) {
            sendResponse({ success: false, error: data.error });
          } else {
            sendResponse({ success: true, data });
          }
        })
        .catch(err => sendResponse({ success: false, error: err.message }));
      } else {
        sendResponse({ success: false, error: 'Not authenticated' });
      }
    });
    return true; // Indicates we will send a response asynchronously
  }
}); 