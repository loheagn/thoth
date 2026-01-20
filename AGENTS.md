# AGENTS.md - Coding Agent Guidelines for Thoth

## Project Overview
Thoth is an AI-powered reading assistant Chrome extension built with React 19, TypeScript 5.9, and Vite. The extension provides translation and vocabulary management features with a Notion-inspired UI.

**Working Directory**: `/Users/bytedance/thoth/browser-extension/`

---

## Build, Test, and Lint Commands

### Development
```bash
cd browser-extension
npm run dev              # Start Vite dev server with hot reload
```

### Building
```bash
npm run build            # TypeScript check (tsc -b) + production build
npm run preview          # Preview production build
```

### Linting
```bash
npm run lint             # Run ESLint on all TS/TSX files
```

### Testing
⚠️ **No test framework configured yet.** When tests are added:
- Recommend: Vitest + React Testing Library
- Test files: `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`
- Run single test: `npm test path/to/file.test.ts` (after setup)

### Extension Loading
1. Run `npm run build` in `browser-extension/`
2. Open Chrome → Extensions → Enable "Developer mode"
3. Click "Load unpacked" → Select `browser-extension/dist/`
4. Reload extension after code changes

---

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode enabled**: Always use strict types
- **Target**: ES2022 with ESNext modules
- **JSX**: `react-jsx` (new transform, no need to import React for JSX)
- **No unused variables**: Disabled in app code, enabled in build scripts
- **Module resolution**: Bundler mode

### Import Patterns
```typescript
// React imports - always explicit (even with new JSX transform)
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Third-party libraries
import { create } from 'zustand';
import { Languages, Book, Trash2 } from 'lucide-react';

// Type imports - use 'type' keyword for better tree-shaking
import type { VocabularyWord, TranslationResult } from '../types';

// Relative imports - no path aliases configured
import { storageService } from '../services/storage';
import { useVocabularyStore } from '../store/vocabulary';
```

**Rules**:
- Always import React explicitly in component files
- Use `import type` for type-only imports
- Relative imports with `../` patterns (no `@` aliases)
- Omit file extensions in imports

### File Naming Conventions
- **Components**: PascalCase with `.tsx` extension
  - `FloatingIcon.tsx`, `TranslationPopover.tsx`, `VocabularyList.tsx`
  - Shadow DOM variants: `.Shadow.tsx` suffix
- **Services/Utils**: camelCase with `.ts` extension
  - `translation.ts`, `storage.ts`, `vocabulary.ts`
- **Types**: `index.ts` in `types/` folder
- **Entry points**: `index.tsx` for React, `index.ts` for plain TS

### Naming Conventions

**Interfaces** (PascalCase):
```typescript
interface VocabularyWord { }
interface TranslationResult { }
interface FloatingIconProps { }  // Component + "Props" suffix
```

**Functions/Methods**:
```typescript
// Event handlers - "handle" prefix
const handleTextSelection = () => { }
const handleIconClick = () => { }
const handleSave = () => { }

// Store actions - verb prefix
loadWords: () => { }
deleteWord: () => { }
clearAll: () => { }
refresh: () => { }

// Private methods - private keyword
private createShadowDOM() { }
private showFloatingIcon() { }
```

**Constants** (UPPER_SNAKE_CASE):
```typescript
const STORAGE_KEY = 'thoth_vocabulary';
const CONTEXT_MENU_ID = 'thoth-translate';
const SHADOW_HOST_ID = 'thoth-extension-root';
```

**Components** (PascalCase):
```typescript
export const FloatingIcon: React.FC<Props> = () => { }
export const TranslationPopover: React.FC<Props> = () => { }
```

### Type System

**Strict TypeScript**:
- `strict: true` enabled
- Avoid `any` types except:
  - Chrome manifest workaround: `manifest as any`
  - Error handling: `error: any` in catch (then check `instanceof Error`)

**Interface Patterns**:
```typescript
// All interfaces exported from types/index.ts
export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  context?: string;      // Optional properties with '?'
  sourceUrl?: string;
  timestamp: number;
}
```

**React Component Typing**:
```typescript
// Functional components with typed props
interface FloatingIconProps {
  position: { x: number; y: number };
  onClick: () => void;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({ position, onClick }) => {
  // State with type inference
  const [isSaved, setIsSaved] = useState(false);  // boolean inferred
  const [words, setWords] = useState<VocabularyWord[]>([]);  // explicit generic
  
  return <div>...</div>;
};
```

**Utility Types**:
```typescript
// Use TypeScript utility types
async saveWord(word: Omit<VocabularyWord, 'id' | 'timestamp'>): Promise<VocabularyWord>
```

### Error Handling

**Service Layer**:
```typescript
async getVocabulary(): Promise<VocabularyWord[]> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return (result[STORAGE_KEY] as VocabularyWord[]) || [];
  } catch (error) {
    console.error('Error getting vocabulary:', error);
    return [];  // Fallback to sensible default
  }
}
```

**Zustand Store**:
```typescript
loadWords: async () => {
  set({ isLoading: true, error: null });
  try {
    const words = await storageService.getVocabulary();
    set({ words, isLoading: false });
  } catch (error) {
    set({ 
      error: error instanceof Error ? error.message : 'Failed to load vocabulary',
      isLoading: false 
    });
  }
}
```

**Rules**:
- Always use try-catch for async operations
- Check `error instanceof Error` before accessing `.message`
- Provide user-friendly fallback messages
- Set loading states before/after operations
- Return sensible defaults (empty arrays, null)

**Chrome Extension Errors**:
```typescript
// Ignore non-listening receivers
chrome.runtime.sendMessage({ action: 'contentScriptReady' }).catch(() => {
  // Ignore errors, background might not be listening
});
```

### Code Organization

**Project Structure**:
```
browser-extension/src/
├── background/         # Service worker (context menus)
├── content/            # Content scripts (injected into pages)
├── popup/              # Extension popup UI
├── components/         # Shared React components
├── services/           # Business logic layer (singleton pattern)
├── store/              # State management (Zustand)
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

**Component Structure**:
```typescript
// 1. Props interface
interface ComponentProps {
  prop: string;
}

// 2. Component definition
export const Component: React.FC<ComponentProps> = ({ prop }) => {
  // 3. Hooks (state, effects, store)
  const [state, setState] = useState(false);
  const { data, loadData } = useVocabularyStore();
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // 4. Event handlers
  const handleClick = () => {
    setState(!state);
  };
  
  // 5. Helper functions
  const formatData = () => { };
  
  // 6. Return JSX
  return <div onClick={handleClick}>{prop}</div>;
};
```

### State Management (Zustand)

**Store Pattern**:
```typescript
interface VocabularyStore {
  // State
  words: VocabularyWord[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadWords: () => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
}

export const useVocabularyStore = create<VocabularyStore>((set, get) => ({
  words: [],
  isLoading: false,
  error: null,
  
  loadWords: async () => {
    set({ isLoading: true, error: null });
    // Implementation
  },
}));
```

**Usage**:
```typescript
const { words, isLoading, loadWords, deleteWord } = useVocabularyStore();
```

### Service Layer (Singleton Pattern)

```typescript
export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async getVocabulary(): Promise<VocabularyWord[]> { }
}

// Export singleton instance
export const storageService = StorageService.getInstance();
```

### Styling with Tailwind CSS

**Custom Notion Theme**:
```typescript
// Use Notion-prefixed custom colors
<div className="bg-notion-bg text-notion-text border-notion-border">
  <button className="notion-button-primary hover:bg-notion-accent-hover">
    Save
  </button>
</div>
```

**Custom Components** (defined in `index.css`):
```typescript
// Use custom component classes
<div className="notion-card">
  <button className="notion-button-primary">Click</button>
</div>
```

**Rules**:
- Use Tailwind utility classes
- Leverage custom Notion theme colors
- Use custom component classes for common patterns
- Shadow DOM components: Use inline styles (no Tailwind)

### Chrome Extension Patterns

**Message Passing**:
```typescript
// Background → Content Script
chrome.tabs.sendMessage(tab.id, {
  action: 'translate',
  text: info.selectionText,
});

// Content Script Listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'contentScriptReady') {
    sendResponse({ success: true });
    return true;  // Keep channel open for async
  }
  return false;  // Close channel
});
```

**Rules**:
- Always return `true` for async responses, `false` otherwise
- Use `.catch(() => {})` for messages that might not have listeners

### Comments and Documentation

**JSDoc for Public APIs**:
```typescript
/**
 * Get all saved vocabulary words
 */
async getVocabulary(): Promise<VocabularyWord[]> { }
```

**Inline Comments**:
- Use sparingly for complex logic
- Prefer self-documenting code
- Explain "why" not "what"

---

## Git and Commit Practices

### .gitignore Configuration
- `node_modules/`
- `dist/`
- `.env*` files
- Editor files (`.vscode/`, `.DS_Store`)

### Commit Messages
No specific convention documented. Recommended:
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Keep first line under 72 characters
- Provide context in commit body for complex changes

---

## Common Patterns and Best Practices

1. **Shadow DOM for CSS Isolation**: Content scripts use Shadow DOM to prevent page CSS conflicts
2. **Dual Component Versions**: Regular components (Tailwind) and Shadow versions (inline styles)
3. **Singleton Services**: All services use singleton pattern for single instance across extension
4. **Mock Services**: Translation service uses mock implementation for MVP
5. **No Backend Yet**: All data stored locally in Chrome storage
6. **React 19**: Uses new JSX transform but still imports React explicitly
7. **Class-based Content Scripts**: Content scripts use OOP pattern for state management

---

## Important Notes for Agents

- **No test framework**: Do not attempt to run tests. If asked to write tests, note that testing infrastructure needs setup first.
- **Working directory**: Always `cd browser-extension` before running npm commands
- **Extension reload**: After builds, extension must be manually reloaded in Chrome
- **No path aliases**: Use relative imports (`../`) instead of absolute paths
- **ESLint**: Flat config format (ESLint 9+), not legacy `.eslintrc`
- **No Prettier**: Rely on ESLint for code style enforcement
- **Chrome API types**: Available via `@types/chrome` package
- **Manifest V3**: Extension uses Manifest V3 (not V2)

---

## Future Improvements Needed

- [ ] Add Vitest + React Testing Library
- [ ] Configure Prettier for consistent formatting
- [ ] Set up GitHub Actions for CI/CD
- [ ] Add path aliases for cleaner imports
- [ ] Remove unused scaffold files (App.tsx, App.css, main.tsx)
- [ ] Replace mock services with real implementations

---

*This file is intended for AI coding agents operating in this repository. Last updated: 2026-01-20*
