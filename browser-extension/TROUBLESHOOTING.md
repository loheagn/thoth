# Troubleshooting: Context Menu Not Working

## Issue Fixed!
I've made the following improvements to fix the context menu issue:

### Changes Made:
1. ✅ Added comprehensive logging to background and content scripts
2. ✅ Fixed message handler to return `true` (keeps channel open)
3. ✅ Improved Shadow DOM CSS injection with fallback inline styles
4. ✅ Created simplified Shadow DOM components without Tailwind dependencies
5. ✅ Added error handling for message sending

## Step 1: Reload the Extension with New Build

```bash
cd browser-extension
npm run build
```

Then:
1. Go to `chrome://extensions/`
2. Find "Thoth - AI Reading Assistant"
3. Click the **refresh icon** (↻) on the extension card
4. **Important**: Now refresh any webpage you want to test on (Cmd+R or Ctrl+R)

> **Note**: Content scripts only inject when a page loads. If you reload the extension, you must also reload the webpage.

## Step 2: Test Both Methods

### Method A: Floating Icon (Should work)
1. Go to any webpage (google.com, wikipedia.org)
2. Select the word "**hello**"
3. A blue circular button appears above the text
4. Click it
5. Translation popover shows: "你好"

### Method B: Context Menu (Now fixed)
1. Select any text
2. Right-click
3. Choose "**Translate with Thoth**"
4. Translation popover appears

## Step 3: Check Logs (If Still Not Working)

### Background Service Worker Logs:
1. Go to `chrome://extensions/`
2. Click **"service worker"** link on Thoth extension
3. DevTools opens - check Console tab

Expected logs:
```
[Thoth Background] Context menu clicked
[Thoth Background] Sending message to tab: 123
[Thoth Background] Message sent successfully
```

### Content Script Logs:
1. Open any webpage
2. Press F12 (DevTools)
3. Go to Console tab
4. Refresh the page

Expected logs:
```
[Thoth] Content script initialized
[Thoth] Message received: {action: 'translate'}
[Thoth] Translating text...
[Thoth] Translation result: {...}
```

## Common Issues & Solutions

### Issue 1: "No [Thoth] Content script initialized" log

**Problem**: Content script not loading

**Solutions**:
- Reload extension: `chrome://extensions/` → click refresh icon
- **Then refresh the webpage** (Cmd+R) - This is critical!
- Try a different website (not chrome:// pages)
- Make sure extension has all permissions

### Issue 2: Background shows "Receiving end does not exist"

**Problem**: Content script not responding

**Solutions**:
- **Refresh the webpage** after reloading the extension
- Content scripts don't work on:
  - chrome:// pages
  - chrome extension pages  
  - Some restricted sites
- Try google.com or wikipedia.org

### Issue 3: Floating icon works but context menu doesn't

**Problem**: Message passing issue (should be fixed now)

**Check**:
- Background console for error messages
- Make sure text is selected before right-clicking
- Try selecting different text

### Issue 4: No visual appears at all

**Problem**: Shadow DOM rendering issue

**Debug**:
Open console and run:
```javascript
// Check if shadow host exists
document.getElementById('thoth-extension-root')

// Check if content script is loaded
console.log('Testing content script')
```

### Issue 5: Works on some sites but not others

**Explanation**: Normal behavior

Some sites may have:
- Content Security Policies (CSP) that block scripts
- Custom right-click menus that override browser menu
- JavaScript that prevents text selection

Try these known-good sites:
- google.com
- wikipedia.org
- github.com
- stackoverflow.com

## Supported Test Words

These words have mock translations:
- **hello** → 你好
- **world** → 世界
- **book** → 书
- **computer** → 计算机
- **language** → 语言
- **translation** → 翻译
- **thank you** → 谢谢
- **goodbye** → 再见

Other words show: `[翻译: word]`

## Still Not Working?

Please report with these details:

1. **What you see in background console**:
   ```
   (paste logs here)
   ```

2. **What you see in page console**:
   ```
   (paste logs here)
   ```

3. **Which website you're testing on**: _______________

4. **Does the floating icon work?**: Yes / No

5. **Any error messages?**: _______________

## Quick Test Script

Run this in the page console to manually test:

```javascript
// Test 1: Check if content script loaded
console.log('Shadow host:', document.getElementById('thoth-extension-root'));

// Test 2: Check if Chrome APIs available
console.log('Chrome runtime:', chrome.runtime);

// Test 3: Get extension ID
console.log('Extension ID:', chrome.runtime.id);

// Test 4: Try to manually send message
chrome.runtime.sendMessage({action: 'test'}, (response) => {
  console.log('Message sent, response:', response);
});
```

## Development Mode

For live reloading during debugging:

```bash
npm run dev
```

This watches for file changes and rebuilds automatically.

1. Make code changes
2. Reload extension in Chrome
3. Refresh the test webpage
4. Test again

---

**Most Common Fix**: Reload extension → Refresh webpage → Try again!
