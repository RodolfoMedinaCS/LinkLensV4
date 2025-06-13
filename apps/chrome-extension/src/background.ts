// This is a simplified background script with no external imports

// Import the Readability script to be injected.
// Note: This path is resolved by the build tool (e.g., Vite/Webpack).
// Make sure your build setup includes this file in the extension's assets.
import readabilityUrl from './lib/Readability.js?url';

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
  const extractAllMetadata = (): {[key: string]: any} => {
    const metadata: { [key: string]: any } = {};
    document.querySelectorAll('meta').forEach(meta => {
      const key = meta.getAttribute('name') || meta.getAttribute('property');
      if (key && meta.getAttribute('content')) {
        metadata[key] = meta.getAttribute('content');
      }
    });
    return metadata;
  };
  const cleanDocumentTitle = (title: string): string => {
    const cleaned = title.replace(/^\s*\((\d+|\d+\+)\)\s*/, '');
    const parts = cleaned.split(/ \| | - /);
    return (parts.length > 1 && parts[0] !== '') ? parts[0].trim() : cleaned.trim();
  };

  // --- Site-Specific Content Isolation ---
  // Before parsing, we try to find the most relevant part of the page.
  let contentToParse: HTMLElement | Document = document; // Default to the whole document

  if (window.location.hostname.includes('reddit.com')) {
    const postElement = document.querySelector('shreddit-post') as HTMLElement;
    if (postElement) {
      console.log("LinkLens Log: Reddit site detected. Isolating post content.");
      contentToParse = postElement;
    }
  } else if (window.location.hostname.includes('stackoverflow.com')) {
    const questionElement = document.querySelector('#question') as HTMLElement;
    if (questionElement) {
      console.log("LinkLens Log: Stack Overflow site detected. Isolating question content.");
      contentToParse = questionElement;
    }
  }

  // Now, run Readability on the most relevant part of the page we found.
  const documentClone = contentToParse.cloneNode(true) as Document;
  const article = new Readability(documentClone).parse();
  const pageContent = article?.textContent;
  
  // --- Metadata and Title Extraction (still runs on the whole document) ---
  const allMeta = extractAllMetadata();
  const rawTitle = allMeta['og:title'] || article?.title || cleanDocumentTitle(document.title);
  const finalTitle = rawTitle.length > 300 ? rawTitle.substring(0, 297) + '...' : rawTitle;

  return {
    url: window.location.href,
    title: finalTitle,
    pageContent: pageContent,
    description: allMeta['og:description'] || article?.excerpt,
    author: article?.byline,
    siteName: allMeta['og:site_name'],
    imageUrl: allMeta['og:image'],
    faviconUrl: findBestFavicon(),
    metadata: allMeta,
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

  // Step 1: Inject the Readability.js library from its file.
  // This is the modern, secure, and correct way to do this.
  chrome.scripting.executeScript({
    target: { tabId },
    files: [readabilityUrl],
  })
  .then(() => {
    console.log("LinkLens Log: Readability.js injected successfully.");
    
    // Step 2: Now that the library is guaranteed to be loaded, run our parsing function.
    chrome.scripting.executeScript({
      target: { tabId },
      func: getPageData, // This function is serialized and run on the page
    }, (injectionResults) => {
      if (chrome.runtime.lastError || !injectionResults?.[0]?.result) {
        console.error(`Extraction failed: ${chrome.runtime.lastError?.message || 'No result returned.'}`);
        sendResponse?.({ success: false, error: "Could not extract page content. Try reloading the page." });
        return;
      }
      const payload: any = injectionResults[0].result;
      
      // Check for custom errors from our script
      if (payload && payload.error) {
         console.error(`Content script error: ${payload.error}`);
         sendResponse?.({ success: false, error: payload.error });
         return;
      }

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