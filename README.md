# Thoth

An AI-powered reading assistant browser extension inspired by Notion's design philosophy.

## Project Structure

```
thoth/
├── browser-extension/     # Chrome Extension (React + TypeScript)
│   ├── src/              # Source code
│   ├── public/           # Static assets and manifest
│   ├── dist/             # Built extension (generated)
│   └── README.md         # Extension documentation
│
└── (future: backend API, web app, etc.)
```

## Getting Started

### Browser Extension

The main application is a Chrome browser extension that provides translation and vocabulary management features.

```bash
cd browser-extension
npm install
npm run build

# Load the extension:
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the browser-extension/dist folder
```

See [browser-extension/QUICKSTART.md](browser-extension/QUICKSTART.md) for detailed setup instructions.

## Features

- 🌐 **Instant Translation**: Select text on any webpage to translate
- 💾 **Vocabulary Collection**: Save translations with context and source URL
- 🎨 **Notion-Style UI**: Clean, minimal design inspired by Notion
- 📚 **Vocabulary Manager**: View, search, and manage your saved words
- 🔄 **Multiple Triggers**: Floating icon or right-click context menu

## Tech Stack

### Browser Extension
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite + @crxjs/vite-plugin
- **Styling**: Tailwind CSS v3
- **State Management**: Zustand
- **Icons**: Lucide React
- **Platform**: Chrome Extension Manifest V3

## Documentation

- [Quick Start Guide](browser-extension/QUICKSTART.md) - Get running in 5 minutes
- [Development Guide](browser-extension/DEVELOPMENT.md) - Detailed development workflow
- [Project Status](browser-extension/PROJECT_STATUS.md) - Complete feature list and status
- [Troubleshooting](browser-extension/TROUBLESHOOTING.md) - Common issues and solutions

## Development Status

✅ **MVP Complete** - Core features implemented and working:
- Text selection and translation UI
- Context menu integration
- Vocabulary saving and management
- Mock translation service
- Notion-inspired design system

🚧 **In Progress**:
- Real translation API integration
- Backend service
- User authentication
- Cloud sync

## Roadmap

- [ ] Real translation API (Google Translate, DeepL, etc.)
- [ ] Backend API for user data
- [ ] User authentication and profiles
- [ ] Cloud sync across devices
- [ ] Multiple language support
- [ ] Vocabulary export (CSV, JSON)
- [ ] Spaced repetition learning
- [ ] Statistics and progress tracking
- [ ] Dark mode
- [ ] Firefox extension
- [ ] Web application

## Repository Structure (Future)

```
thoth/
├── browser-extension/      # Chrome/Firefox extension
├── backend/               # API server (Node.js/Python)
├── web/                   # Web application (Next.js)
├── mobile/                # Mobile apps (React Native)
├── shared/                # Shared types and utilities
└── docs/                  # Documentation
```

## Contributing

Currently in initial development phase. Contribution guidelines will be added soon.

## License

MIT

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Current Version**: v1.0.0 (MVP)  
**Last Updated**: January 2026
