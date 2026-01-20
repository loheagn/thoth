// Background service worker for Thoth extension

const CONTEXT_MENU_ID = 'thoth-translate';

// Initialize context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Translate with Thoth',
    contexts: ['selection'],
  });

  console.log('[Thoth Background] Extension installed successfully');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('[Thoth Background] Context menu clicked', { info, tab });
  
  if (info.menuItemId === CONTEXT_MENU_ID && tab?.id) {
    console.log('[Thoth Background] Sending message to tab:', tab.id);
    console.log('[Thoth Background] Selected text:', info.selectionText);
    
    try {
      // Try to send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'translate',
        text: info.selectionText,
      });
      console.log('[Thoth Background] Response received:', response);
    } catch (error: any) {
      console.error('[Thoth Background] Error sending message:', error);
      
      // If content script not responding, alert user
      if (error.message && error.message.includes('Receiving end does not exist')) {
        console.warn('[Thoth Background] Content script not loaded. User needs to refresh the page.');
        // You could show a notification here in the future
      }
    }
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Thoth Background] Message received:', message, 'from', sender.tab?.id);
  
  if (message.action === 'contentScriptReady') {
    // Content script is ready
    if (sender.tab?.id) {
      console.log('[Thoth Background] Content script ready on tab:', sender.tab.id);
    }
    sendResponse({ success: true });
    return true;
  }
  
  if (message.action === 'openPopup') {
    // Open extension popup programmatically
    chrome.action.openPopup();
    sendResponse({ success: true });
    return true;
  }
  
  // Don't return true for unhandled messages
  return false;
});

console.log('[Thoth Background] Service worker loaded');
