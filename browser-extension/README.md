# Thoth - AI Reading Assistant

An AI-powered browser extension for translating and learning vocabulary, inspired by Notion's design philosophy.

## Features

- **Text Selection Translation**: Select any text on a webpage to see an instant translation
- **Floating UI**: Clean, non-intrusive floating icon and popover interface
- **Context Menu**: Right-click selected text to translate with Thoth
- **Vocabulary Collection**: Save translations to build your personal vocabulary list
- **Notion-Style Design**: Beautiful, minimalist UI with Notion-inspired aesthetics

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite + @crxjs/vite-plugin
- **Styling**: Tailwind CSS with custom Notion theme
- **State Management**: Zustand
- **Storage**: Chrome Storage API
- **Icons**: Lucide React

## Project Structure

```
browser-extension/
├── public/
│   ├── manifest.json       # Chrome Extension manifest
│   └── icons/              # Extension icons (16, 32, 48, 128)
├── src/
│   ├── background/         # Background service worker
│   ├── content/            # Content script (runs on web pages)
│   ├── popup/              # Extension popup UI
│   ├── components/         # Shared React components
│   ├── services/           # Business logic (translation, storage)
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript type definitions
└── index.html              # Popup HTML entry point
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development mode:
```bash
npm run dev
```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `browser-extension/dist` folder

### Build for Production

```bash
npm run build
```

The built extension will be in the `dist/` folder.

## Usage

1. **Translate Text**:
   - Select any text on a webpage
   - Click the floating Thoth icon that appears
   - Or right-click and select "Translate with Thoth"

2. **Save Vocabulary**:
   - After translation appears, click "Save to Vocabulary"
   - Word is saved with context and source URL

3. **View Vocabulary**:
   - Click the Thoth extension icon in your browser toolbar
   - Browse, search, and manage your saved words

## Mock Services

Currently, the extension uses mock services:
- **Translation**: Simulated translations with common words
- **Storage**: Chrome local storage for vocabulary persistence

In production, these will be replaced with actual API calls to a backend service.

## Customization

### Notion Theme Colors

Edit `tailwind.config.js` to customize the Notion-inspired color palette:

```js
colors: {
  notion: {
    bg: '#FFFFFF',
    'bg-secondary': '#F7F6F3',
    text: '#37352F',
    // ...more colors
  },
}
```

## Roadmap

- [ ] Real translation API integration
- [ ] Multiple language support
- [ ] Vocabulary export (CSV, JSON)
- [ ] Spaced repetition learning
- [ ] Dark mode
- [ ] Sync across devices
- [ ] Advanced search and filtering
- [ ] Statistics and progress tracking

## License

MIT

