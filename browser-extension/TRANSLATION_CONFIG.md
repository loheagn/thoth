# Translation Configuration Guide

This document explains the configurable LLM-based translation system implemented in Thoth.

## Overview

Thoth now supports configurable translation services using OpenAI-compatible APIs. This allows users to:
- Use any OpenAI-compatible LLM API (OpenAI, Azure OpenAI, local models, etc.)
- Configure API endpoints, models, and generation parameters
- Translate English text to Chinese using a built-in professional translation prompt

## Architecture

### Components

1. **Type Definitions** (`src/types/index.ts`)
   - `TranslationConfig`: Configuration interface for API settings
   - `LLMMessage`, `LLMRequest`, `LLMResponse`: OpenAI-compatible API types

2. **Configuration Service** (`src/services/config.ts`)
   - Manages translation API configuration storage
   - Provides default settings
   - Caches configuration for performance
   - Key methods:
     - `getConfig()`: Retrieve current configuration
     - `saveConfig(config)`: Save new configuration
     - `isConfigured()`: Check if API key is set
     - `resetConfig()`: Reset to defaults

3. **LLM Client** (`src/services/llm.ts`)
   - Handles communication with OpenAI-compatible APIs
   - Implements translation logic with built-in prompt
   - Key methods:
     - `translate(text, context?)`: Translate text to Chinese
     - `testConnection()`: Test API connectivity

4. **Translation Service** (`src/services/translation.ts`)
   - Updated to use LLM API instead of mock data
   - Handles error cases gracefully
   - Returns user-friendly messages when not configured

5. **Settings UI** (`src/components/Settings.tsx`)
   - React component for configuration interface
   - Features:
     - API endpoint configuration
     - Secure API key input (with show/hide)
     - Model selection
     - Temperature slider (0-1)
     - Max tokens input
     - Test connection button
     - Save settings button
     - Reset to defaults

6. **Updated Popup** (`src/popup/Popup.tsx`)
   - Added tabbed interface (Vocabulary | Settings)
   - Integrated Settings component

## Translation Prompt

The system uses a carefully crafted prompt for English to Chinese translation:

```
You are a professional translator specializing in English to Chinese translation. Your task is to:

1. Translate the given English text to natural, fluent Chinese
2. Preserve the original meaning and tone
3. Consider context when available
4. For technical terms, use commonly accepted Chinese translations
5. For proper nouns, keep the original or use standard Chinese transliterations

Respond ONLY with the Chinese translation, no explanations or additional text.
```

## Configuration Options

### API Endpoint
- Default: `https://api.openai.com/v1/chat/completions`
- Supports any OpenAI-compatible endpoint
- Examples:
  - OpenAI: `https://api.openai.com/v1/chat/completions`
  - Azure OpenAI: `https://{resource}.openai.azure.com/openai/deployments/{deployment}/chat/completions?api-version=2024-02-15-preview`
  - Local: `http://localhost:1234/v1/chat/completions`

### API Key
- Required for translation to work
- Stored locally in Chrome storage
- Never transmitted except to configured endpoint
- Displayed as password field with show/hide toggle

### Model
- Default: `gpt-3.5-turbo`
- Examples:
  - OpenAI: `gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo`
  - Claude (via compatible proxy): `claude-3-opus`, `claude-3-sonnet`
  - Local models: Model name from your local server

### Temperature
- Range: 0-1
- Default: 0.3
- Lower values (0.1-0.3): More focused, deterministic translations
- Higher values (0.7-1.0): More creative, varied translations
- Recommended: 0.3 for consistent translation quality

### Max Tokens
- Range: 100-2000
- Default: 500
- Maximum length of translation response
- Adjust based on typical text length you translate

## Usage Flow

### First-Time Setup

1. Open extension popup
2. Click "Settings" tab
3. Enter API configuration:
   - API Endpoint (use default for OpenAI)
   - API Key (get from your provider)
   - Model (use default or choose preferred model)
   - Adjust Temperature/Max Tokens if needed
4. Click "Test Connection" to verify setup
5. Click "Save Settings"

### Translation Workflow

1. Select text on any webpage
2. Extension automatically translates using configured API
3. View translation in popup
4. Save to vocabulary if desired

### Error Handling

The system provides clear error messages:
- **Not configured**: Prompts user to set up API key in settings
- **API errors**: Displays specific error from API (auth, rate limit, etc.)
- **Network errors**: Shows connection failure message
- **Invalid response**: Handles malformed API responses

## Storage

Configuration is stored in Chrome's local storage:
- Key: `thoth_translation_config`
- Scope: Per Chrome profile
- Syncing: Not synced across devices (local only for security)
- Size: Minimal (~200 bytes)

## Security Considerations

1. **API Key Storage**: Stored in Chrome local storage, not synced
2. **HTTPS Only**: Recommends HTTPS endpoints (allows HTTP for local testing)
3. **No Telemetry**: API keys never sent to any third party
4. **Local-First**: All configuration stays on user's machine

## Performance

- **Caching**: Configuration cached in memory after first load
- **Lazy Loading**: API not called until translation requested
- **Timeout**: No timeout implemented (relies on fetch default)
- **Retry Logic**: Not implemented (fails fast with clear error)

## Future Enhancements

Potential improvements for future versions:

1. **Multiple Languages**: Support target languages beyond Chinese
2. **Custom Prompts**: Allow users to customize translation prompts
3. **Provider Presets**: Quick setup for popular providers
4. **Streaming**: Support streaming responses for long texts
5. **Batch Translation**: Translate multiple selections at once
6. **Translation History**: Cache translations to reduce API calls
7. **Cost Tracking**: Track API usage and estimated costs
8. **Fallback Providers**: Auto-switch to backup provider on failure

## Testing

### Manual Testing Checklist

- [ ] Configure API with valid credentials
- [ ] Test connection successfully
- [ ] Translate text from webpage
- [ ] Save translated word to vocabulary
- [ ] Test with invalid API key (should show error)
- [ ] Test with unreachable endpoint (should handle gracefully)
- [ ] Reset settings to defaults
- [ ] Verify settings persist after browser restart

### Edge Cases

- Empty API key: Shows configuration prompt
- Invalid endpoint: Shows connection error
- API rate limit: Shows rate limit error from provider
- Very long text: Respects max tokens setting
- Special characters: Properly encoded in API request

## Troubleshooting

### "Not configured" message
- Go to Settings tab and enter your API key

### "API request failed: 401"
- Check API key is correct
- Verify API key has proper permissions

### "API request failed: 429"
- Rate limit exceeded, wait and try again
- Consider upgrading API plan

### "Failed to fetch"
- Check internet connection
- Verify API endpoint URL is correct
- Check if endpoint is accessible from your network

### Translation is cut off
- Increase "Max Tokens" in settings
- Try shorter text selections

### Translation quality issues
- Adjust temperature (lower for consistency)
- Try different model (e.g., GPT-4 for better quality)
- Ensure selected text has clear context

## API Provider Examples

### OpenAI
```
Endpoint: https://api.openai.com/v1/chat/completions
API Key: sk-...
Model: gpt-3.5-turbo (or gpt-4)
```

### Azure OpenAI
```
Endpoint: https://{resource}.openai.azure.com/openai/deployments/{deployment}/chat/completions?api-version=2024-02-15-preview
API Key: Your Azure OpenAI key
Model: Your deployment name
```

### Local LLM (Ollama, LM Studio, etc.)
```
Endpoint: http://localhost:1234/v1/chat/completions
API Key: (leave as 'sk-local' or any placeholder)
Model: Your local model name
```

---

**Version**: 1.0  
**Last Updated**: 2026-01-20  
**Status**: Production Ready
