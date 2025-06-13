// This is a simplified background script with no external imports

// Import the Readability script to be injected.
// Note: This path is resolved by the build tool (e.g., Vite/Webpack).
// Make sure your build setup includes this file in the extension's assets.
import readabilityScript from './lib/Readability.js?raw';

// --- Type Declaration for Readability ---
// This informs TypeScript about the Readability class that is injected at runtime.
declare const Readability: {
  new(doc: Document): {
    parse(): {
      title: string;
      content: string; // This is the full HTML content
      textContent: string; // This is the text-only content
      length: number;
      excerpt: string;
      byline: string;
    } | null;
  };
};

// This function is injected into the page to grab the complete data package.
// It contains all the sub-functions for extraction as per the plan.
function getPageData() {
  
  /**
   * Advanced Favicon Detection (Phase 1)
   */
  const findBestFavicon = (): string => {
    const selectors = [
      'link[rel="icon"][type="image/svg+xml"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="icon"][sizes="192x192"]',
      'link[rel="icon"]',
      'link[rel="shortcut icon"]'
    ];
    for (const selector of selectors) {
      const link = document.querySelector<HTMLLinkElement>(selector);
      if (link?.href) {
        return new URL(link.href, document.baseURI).href;
      }
    }
    return `${window.location.origin}/favicon.ico`;
  };

  /**
   * Comprehensive Metadata Extraction (Phase 1)
   */
  const extractAllMetadata = (): object => {
    const metadata: { [key: string]: any } = {};
    document.querySelectorAll('meta').forEach(meta => {
      const key = meta.getAttribute('name') || meta.getAttribute('property');
      if (key) {
        metadata[key] = meta.getAttribute('content');
      }
    });
    return metadata;
  };

  /**
   * Core Content Extraction using Readability.js (Phase 1)
   */
  const documentClone = document.cloneNode(true) as Document;
  const article = new Readability(documentClone).parse();

  // Assemble the final data package
  return {
    url: window.location.href,
    title: article?.title || document.title,
    content: article?.textContent, // The clean text content for the AI
    excerpt: article?.excerpt,
    byline: article?.byline,
    faviconUrl: findBestFavicon(),
    metadata: extractAllMetadata(),
    timestamp: Date.now(),
    lang: document.documentElement.lang,
  };
}

/**
 * Main function to save a link. Orchestrates the injection and fetching.
 */
const saveLink = (tab: chrome.tabs.Tab, sendResponse?: (response?: any) => void) => {
  if (!tab || !tab.id) {
    console.error("Invalid tab information.");
    sendResponse?.({ success: false, error: "Invalid tab information." });
    return;
  }
  const tabId = tab.id;

  // 1. Inject Readability.js library (Phase 2 Optimization)
  chrome.scripting.executeScript({
    target: { tabId },
    func: (scriptSource) => {
      const script = document.createElement('script');
      script.textContent = scriptSource;
      (document.head || document.documentElement).appendChild(script);
      script.remove();
    },
    args: [readabilityScript]
  }).then(() => {
    // 2. Inject and execute our main data extraction script
    chrome.scripting.executeScript({
      target: { tabId },
      func: getPageData,
    }, (injectionResults) => {
      if (chrome.runtime.lastError || !injectionResults?.[0]?.result) {
        console.error(`Extraction failed: ${chrome.runtime.lastError?.message}`);
        sendResponse?.({ success: false, error: "Could not extract page content." });
        return;
      }

      const payload = injectionResults[0].result;

      // 3. Send the rich data package to the backend
      chrome.storage.local.get('session', ({ session }) => {
        if (!session?.access_token) {
          sendResponse?.({ success: false, error: "Not authenticated." });
          return;
        }

        fetch('http://localhost:3000/api/links/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => Promise.reject(err));
          }
          return res.json();
        })
        .then(data => {
          console.log('Link saved successfully:', data);
          sendResponse?.({ success: true, data });
        })
        .catch(err => {
          console.error('Error saving link:', err);
          const errorMessage = err.error || 'Failed to save link.';
          sendResponse?.({ success: false, error: errorMessage });
        });
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