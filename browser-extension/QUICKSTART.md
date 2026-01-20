# Quick Start Guide

Get the Thoth extension running in 5 minutes!

## Step 1: Build the Extension

```bash
cd browser-extension
npm run build
```

Expected output:
```
✓ built in 1.01s
```

## Step 2: Load Extension in Chrome

1. Open Chrome
2. Type `chrome://extensions/` in the address bar
3. Turn on "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Navigate to and select: `browser-extension/dist`

You should see:
- **Thoth - AI Reading Assistant** in your extensions list
- A small "T" icon in your Chrome toolbar

## Step 3: Open a Test Page

**IMPORTANT**: Open a NEW tab or refresh an existing tab after loading the extension!

1. Open a new tab (Cmd+T / Ctrl+T)
2. Go to any website (try google.com or wikipedia.org)
3. The content script will load automatically

> **Why?** Content scripts only load when pages are opened/refreshed. If you load the extension on an already-open page, you must refresh that page.

## Step 4: Test It Out!

### Test 1: Floating Icon ✅
1. Select the word "**hello**" on any webpage
2. A blue floating icon appears above the selection
3. Click the icon
4. See translation: "你好"

### Test 2: Context Menu ✅
1. Select any text on a webpage
2. Right-click
3. Choose "**Translate with Thoth**"
4. Translation popover appears

### Test 3: Save Vocabulary
1. After seeing a translation, click "**Save to Vocabulary**"
2. Button changes to "Saved ✓"
3. Click the Thoth icon in Chrome toolbar
4. See your saved word in the list!

### Test 4: Vocabulary Management
1. Click Thoth icon in toolbar
2. View your saved words
3. Hover over a word to see delete button
4. Click refresh icon to reload
5. Click trash icon (and again to confirm) to clear all

## Supported Words (Mock Translation)

Try these words for working translations:
- hello
- world
- book
- computer
- language
- translation
- assistant
- reading
- thank you
- goodbye
- please
- yes
- no
- help

Other words will show: `[翻译: word]` (placeholder translation)

## If Something Goes Wrong

### Error: "Receiving end does not exist"

**Solution**: Refresh the webpage!

```
After reloading the extension:
1. Go to chrome://extensions/
2. Click the ↻ refresh icon on Thoth
3. Go back to your test page
4. Press Cmd+R / Ctrl+R to refresh   ← DON'T FORGET THIS!
5. Try again
```

### Extension doesn't appear?
```bash
# Rebuild
cd browser-extension
npm run build

# Then reload in chrome://extensions/
```

### No floating icon appears?
- **Did you refresh the page after loading the extension?** ← Most common issue!
- Check the webpage console (F12) for errors
- Try a different website
- Make sure you selected text with your mouse

### Translation doesn't show?
- Try selecting one of the supported words (see list above)
- Check the console for errors
- Reload the extension

### Popup is blank?
- Right-click the Thoth icon → Inspect
- Check console for errors
- Rebuild the extension

## Development Workflow

**Important**: Always refresh webpages after reloading the extension!

```
Make changes → npm run build → Reload extension → REFRESH PAGE → Test
                                                   ^^^^^^^^^^^^
                                                   CRITICAL!
```

## Next Steps

- Add more words to mock translation dictionary (`src/services/translation.ts`)
- Customize the Notion theme colors (`tailwind.config.js`)
- Replace placeholder icons (`public/icons/`)
- Integrate a real translation API
- Read `DEVELOPMENT.md` for detailed info

## Development Mode

Want to make changes?

```bash
# Start dev server (watches for changes)
npm run dev

# Make changes to src/ files
# Vite rebuilds automatically

# Reload extension in chrome://extensions/
# Refresh the webpage you're testing
```

---

**Need help?** Check:
- `FIX_RECEIVING_END_ERROR.md` - For context menu issues
- `DEVELOPMENT.md` - For troubleshooting and detailed guides
