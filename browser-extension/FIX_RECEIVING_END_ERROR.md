# Fix: "Receiving end does not exist" Error

## The Problem

You're seeing this error:
```
Error sending message: Error: Could not establish connection. Receiving end does not exist.
```

**But the floating icon works fine!**

## Why This Happens

This is a **timing/reload issue**:

1. You reload the extension in `chrome://extensions/`
2. The **background script** gets the new version immediately
3. But the **content script** on already-open pages is still the OLD version
4. When you use the context menu, the new background script tries to talk to the old content script
5. Result: "Receiving end does not exist" error

## The Fix (Simple!)

**After reloading the extension, you MUST refresh any open webpages:**

1. Go to `chrome://extensions/`
2. Click the refresh icon on Thoth extension ↻
3. **Go to your test webpage**
4. **Press Cmd+R (Mac) or Ctrl+R (Windows)** to refresh the page
5. Now try the context menu

## Why Does The Floating Icon Work?

The floating icon works because it's triggered by a mouse event directly on the page (not a message from background). It uses the content script that's already loaded on the page.

But the context menu is triggered by:
1. Background script receives context menu click
2. Background script sends message to content script  
3. Content script responds with translation

If the content script is an old version, step 2 fails.

## Quick Test

To verify this is the issue, open the console on your test page (F12) and look for:

```
[Thoth] Content script initialized
[Thoth] Message listener registered
```

If you don't see these messages, the content script didn't load. **Refresh the page!**

## Permanent Solution

This is just a development quirk. In production (when users install from Chrome Web Store):
- Extension is loaded once
- Content scripts inject into pages as they load
- No reload issues

## Step-by-Step Testing Process

```bash
# 1. Build extension
cd browser-extension
npm run build

# 2. In Chrome:
#    - Open chrome://extensions/
#    - Click refresh ↻ on Thoth

# 3. Open a NEW tab (or refresh existing tab)
#    - Go to google.com or any site
#    - Press Cmd+R / Ctrl+R

# 4. Test:
#    - Select text
#    - Right-click → "Translate with Thoth"
#    - Should work now!
```

## Verify Content Script is Loaded

On any test page, open console (F12) and run:

```javascript
// Check if content script is loaded
console.log('Shadow host:', document.getElementById('thoth-extension-root'));

// Should return a div element, not null
```

If it returns `null`, refresh the page!

## Advanced: Check Both Consoles

### Background Console:
1. Go to `chrome://extensions/`
2. Click "service worker" link under Thoth
3. Try context menu
4. Look for: `[Thoth Background] Response received: {success: true}`

### Page Console:
1. Open F12 on test page
2. Refresh page
3. Look for: `[Thoth] Content script initialized`
4. Try context menu
5. Look for: `[Thoth] Message received: {action: 'translate'}`

## Summary

✅ **Floating icon works** = Content script IS loaded  
❌ **Context menu fails** = Old content script or page not refreshed

**Solution**: Always refresh the webpage after reloading the extension!

---

## Updated Testing Workflow

```
Change code → npm run build → Reload extension → REFRESH WEBPAGE → Test
                                                    ^^^^^^^^^^^^^^
                                                    DON'T FORGET!
```

This is normal Chrome extension development behavior and only affects testing, not end users!