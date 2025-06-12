// This is a simplified background script with no external imports

// This function is injected into the page to grab a complete, rich data package.
function getPageData() {
  /**
   * Finds the best possible favicon URL from the document's head.
   * It prioritizes modern, high-quality icons like SVG and apple-touch-icon.
   */
  const findBestFavicon = (): string => {
    const selectors = [
      "link[rel='icon'][type='image/svg+xml']",
      "link[rel='apple-touch-icon']",
      "link[rel='icon']",
      "link[rel='shortcut icon']"
    ];

    for (const selector of selectors) {
      const link = document.querySelector<HTMLLinkElement>(selector);
      if (link && link.href) {
        // Ensure the URL is absolute
        return new URL(link.href, document.baseURI).href;
      }
    }
    // Final fallback to the default favicon.ico at the domain root
    return new URL('/favicon.ico', document.baseURI).href;
  };

  return {
    title: document.title,
    pageContent: document.body.innerText,
    faviconUrl: findBestFavicon()
  };
}

/**
 * Saves a link to the backend using a rich data package from the page.
 * @param {chrome.tabs.Tab} tab The tab to save.
 * @param {function} sendResponse Optional callback for message listeners.
 */
const saveLink = (tab: chrome.tabs.Tab, sendResponse?: (response?: any) => void) => {
  if (!tab || !tab.id || !tab.url) {
    const errorMsg = "Invalid tab information.";
    console.error(errorMsg);
    sendResponse?.({ success: false, error: errorMsg });
    return;
  }

  // 1. Inject the smart content script to get the full data package.
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getPageData,
  }, (injectionResults) => {
    if (chrome.runtime.lastError) {
      const errorMsg = `Script injection failed: ${chrome.runtime.lastError.message}`;
      console.error(errorMsg);
      // Even if script fails, we can proceed with basic info from the tab object.
    }

    const result = injectionResults && injectionResults[0] ? injectionResults[0].result : null;

    // 2. Build the payload, prioritizing fresh data from the script but using the tab as a fallback.
    const payload = {
      url: tab.url,
      title: result?.title || tab.title || 'Link',
      faviconUrl: result?.faviconUrl || tab.favIconUrl || '',
      pageContent: result?.pageContent || ''
    };

    // 3. Get user's session token
    chrome.storage.local.get('session', ({ session }) => {
      if (!session?.access_token) {
        const errorMsg = "Not authenticated. Cannot save link.";
        console.error(errorMsg);
        sendResponse?.({ success: false, error: errorMsg });
        return;
      }

      // 4. Send the rich data package to the backend
      fetch('http://localhost:3000/api/links/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('Error saving link:', data.error);
          sendResponse?.({ success: false, error: data.error });
        } else {
          console.log('Link save initiated:', data);
          sendResponse?.({ success: true, data });
        }
      })
      .catch(err => {
        console.error('Error saving link:', err.message);
        sendResponse?.({ success: false, error: err.message });
      });
    });
  });
};


// --- Listener for messages from the Web App (for session sync) ---
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.type === 'SYNC_SESSION') {
    const { session } = request;
    console.log('Received SYNC_SESSION message:', session);

    const handleSession = async (sessionData: any) => {
      try {
        if (sessionData) {
          await chrome.storage.local.set({ session: sessionData });
          console.log('Extension session has been set.');
          sendResponse({ success: true });
        } else {
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


// --- Listener for messages from our own popup ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveLink') {
    saveLink(request.tab, sendResponse);
    return true;
  }
});


// --- Listener for the keyboard shortcut command ---
chrome.commands.onCommand.addListener((command) => {
  if (command === "save-link-command") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        saveLink(tabs[0]);
      } else {
        console.error("No active tab found to save.");
      }
    });
  }
}); 