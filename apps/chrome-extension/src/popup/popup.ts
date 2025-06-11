console.log("Popup script started.");

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM content loaded.");

  const loginButton = document.getElementById('login-button') as HTMLButtonElement;
  const saveButton = document.getElementById('save-button') as HTMLButtonElement;
  const statusMessage = document.getElementById('status-message') as HTMLParagraphElement;

  if (!loginButton || !saveButton || !statusMessage) {
    console.error("Popup DOM elements not found. Check popup.html IDs.");
    if (statusMessage) {
        statusMessage.textContent = "Error: UI elements missing.";
    }
    return;
  }
  console.log("Popup DOM elements found.");

  // Check auth state on open
  console.log("Checking auth state from chrome.storage...");
  chrome.storage.local.get('session', ({ session }) => {
    console.log("Auth state from storage:", session);
    if (session?.user) {
      statusMessage.textContent = `Logged in as ${session.user.email}`;
      loginButton.style.display = 'none';
      saveButton.style.display = 'block';
    } else {
      statusMessage.textContent = 'Please log in to LinkLens.';
      loginButton.style.display = 'block';
      saveButton.style.display = 'none';
    }
  });

  // Event Listeners
  loginButton.addEventListener('click', () => {
    console.log("Login button clicked.");
    chrome.tabs.create({ url: 'http://localhost:3000/auth/login' });
  });

  saveButton.addEventListener('click', async () => {
    console.log("Save button clicked.");
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab?.url) {
      statusMessage.textContent = "Could not get tab URL.";
      return;
    }
    
    console.log(`Sending saveLink message for URL: ${tab.url}`);
    // Tell the background script to do the work
    chrome.runtime.sendMessage({ action: 'saveLink', url: tab.url }, (response) => {
      console.log("Response from background script:", response);
      if (response?.success) {
        statusMessage.textContent = 'Link Saved!';
      } else {
        statusMessage.textContent = `Error: ${response?.error || 'Unknown error'}`;
      }
    });
  });
}); 