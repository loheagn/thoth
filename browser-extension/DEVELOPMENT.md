# Thoth Extension - Development Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd browser-extension
npm install
```

### 2. Create Placeholder Icons

The extension requires icon files. Create simple placeholders:

**Option A: Use any square image**
- Find or create a 128x128 PNG image
- Name it `icon128.png`, `icon48.png`, `icon32.png`, `icon16.png`
- Place in `public/icons/` directory

**Option B: Use ImageMagick (if installed)**
```bash
convert -size 128x128 xc:#2383E2 -gravity center -pointsize 48 -fill white -annotate +0+0 "T" public/icons/icon128.png
convert public/icons/icon128.png -resize 48x48 public/icons/icon48.png
convert public/icons/icon128.png -resize 32x32 public/icons/icon32.png
convert public/icons/icon128.png -resize 16x16 public/icons/icon16.png
```

### 3. Start Development Server

```bash
npm run dev
```

This will:
- Start Vite dev server
- Build extension files to `dist/`
- Watch for changes and rebuild

### 4. Load Extension in Chrome

1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `browser-extension/dist` folder

### 5. Test the Extension

1. Navigate to any webpage
2. Select some text
3. See the floating Thoth icon appear
4. Click it to see the translation
5. Save words to vocabulary
6. Click the extension icon to view saved words

## Development Workflow

### Making Changes

1. Edit code in `src/`
2. Vite will automatically rebuild
3. Reload the extension in Chrome:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the Thoth extension card
4. Refresh the webpage you're testing on

### Project Structure

```
src/
├── background/
│   └── index.ts           # Service worker (context menus, messages)
├── content/
│   └── index.tsx          # Content script (runs on pages, handles selection)
├── popup/
│   ├── index.tsx          # Popup entry point
│   └── Popup.tsx          # Main popup component
├── components/
│   ├── FloatingIcon.tsx   # Floating translate button
│   ├── TranslationPopover.tsx  # Translation result card
│   └── VocabularyList.tsx # Saved words list
├── services/
│   ├── translation.ts     # Mock translation API
│   └── storage.ts         # Chrome storage wrapper
├── store/
│   └── vocabulary.ts      # Zustand state management
└── types/
    └── index.ts           # TypeScript types
```

### Key Technologies

- **React 18**: UI components
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling (Notion theme)
- **Zustand**: State management
- **Lucide React**: Icons
- **@crxjs/vite-plugin**: Chrome extension build tool

## Common Issues

### Extension not loading
- Ensure `dist/` folder exists and contains `manifest.json`
- Check for build errors in terminal
- Try removing and re-adding the extension

### Changes not reflecting
- Reload extension in `chrome://extensions/`
- Hard refresh the webpage (Cmd+Shift+R / Ctrl+Shift+F5)
- Clear browser cache

### TypeScript errors
- Run `npm run build` to see detailed errors
- Check `tsconfig.json` configuration
- Ensure all types are properly imported

### Styling issues
- Tailwind classes not working? Check `tailwind.config.js`
- Content script styles isolated in Shadow DOM
- Popup has separate styling context

## Building for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder ready for:
- Chrome Web Store submission
- Manual distribution
- Testing on other machines

## Testing Strategy

### Manual Testing Checklist

- [ ] Text selection shows floating icon
- [ ] Icon click triggers translation
- [ ] Context menu "Translate with Thoth" works
- [ ] Translation popover displays correctly
- [ ] Save to vocabulary button works
- [ ] Popup shows saved words
- [ ] Delete word functionality works
- [ ] Clear all functionality works
- [ ] Extension works on different websites
- [ ] No console errors in background page
- [ ] No console errors in content script
- [ ] No console errors in popup

### Check Console Logs

**Background Service Worker:**
- `chrome://extensions/` → Thoth → "service worker" link

**Content Script:**
- Open DevTools on any webpage (F12)
- Look for Thoth-related logs

**Popup:**
- Right-click popup → Inspect

## Next Steps

1. Replace mock translation service with real API
2. Add more vocabulary management features
3. Implement user authentication
4. Add settings/options page
5. Improve error handling
6. Add loading states
7. Implement search/filter for vocabulary
8. Add export functionality
9. Create proper branding/icons
10. Write automated tests

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/develop/migrate)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vite](https://vitejs.dev/)
