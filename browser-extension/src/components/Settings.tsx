import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Check, X, Loader } from 'lucide-react';
import type { TranslationConfig } from '../types';
import { configService } from '../services/config';
import { llmClient } from '../services/llm';

export const Settings: React.FC = () => {
  const [config, setConfig] = useState<TranslationConfig>({
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
    maxTokens: 500,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const loadedConfig = await configService.getConfig();
      setConfig(loadedConfig);
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      await configService.saveConfig(config);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!config.apiKey.trim()) {
      setTestStatus('error');
      setErrorMessage('Please enter an API key first');
      setTimeout(() => setTestStatus('idle'), 3000);
      return;
    }

    setIsTesting(true);
    setTestStatus('idle');
    setErrorMessage('');

    try {
      // Save config first
      await configService.saveConfig(config);
      
      // Test connection
      const success = await llmClient.testConnection();
      
      if (success) {
        setTestStatus('success');
        setTimeout(() => setTestStatus('idle'), 3000);
      } else {
        setTestStatus('error');
        setErrorMessage('Connection test failed');
      }
    } catch (error) {
      setTestStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset all settings to default values?')) {
      await configService.resetConfig();
      await loadConfig();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-notion-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon size={20} className="text-notion-accent" />
        <h2 className="text-lg font-semibold text-notion-text">Translation Settings</h2>
      </div>

      {/* API Endpoint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-notion-text">
          API Endpoint
        </label>
        <input
          type="text"
          value={config.apiEndpoint}
          onChange={(e) => setConfig({ ...config, apiEndpoint: e.target.value })}
          className="w-full px-3 py-2 bg-notion-bg border border-notion-border rounded-notion text-notion-text text-sm focus:outline-none focus:border-notion-accent transition-colors"
          placeholder="https://api.openai.com/v1/chat/completions"
        />
        <p className="text-xs text-notion-text-tertiary">
          OpenAI-compatible API endpoint
        </p>
      </div>

      {/* API Key */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-notion-text">
          API Key
        </label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            className="w-full px-3 py-2 bg-notion-bg border border-notion-border rounded-notion text-notion-text text-sm focus:outline-none focus:border-notion-accent transition-colors pr-16"
            placeholder="sk-..."
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-notion-text-secondary hover:text-notion-text transition-colors"
          >
            {showApiKey ? 'Hide' : 'Show'}
          </button>
        </div>
        <p className="text-xs text-notion-text-tertiary">
          Your API key is stored locally and never sent anywhere except your configured endpoint
        </p>
      </div>

      {/* Model */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-notion-text">
          Model
        </label>
        <input
          type="text"
          value={config.model}
          onChange={(e) => setConfig({ ...config, model: e.target.value })}
          className="w-full px-3 py-2 bg-notion-bg border border-notion-border rounded-notion text-notion-text text-sm focus:outline-none focus:border-notion-accent transition-colors"
          placeholder="gpt-3.5-turbo"
        />
        <p className="text-xs text-notion-text-tertiary">
          Model name (e.g., gpt-3.5-turbo, gpt-4, claude-3-opus)
        </p>
      </div>

      {/* Temperature */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-notion-text">
          Temperature: {config.temperature}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.temperature}
          onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
          className="w-full"
        />
        <p className="text-xs text-notion-text-tertiary">
          Lower values make output more focused and deterministic
        </p>
      </div>

      {/* Max Tokens */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-notion-text">
          Max Tokens
        </label>
        <input
          type="number"
          min="100"
          max="2000"
          step="50"
          value={config.maxTokens}
          onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
          className="w-full px-3 py-2 bg-notion-bg border border-notion-border rounded-notion text-notion-text text-sm focus:outline-none focus:border-notion-accent transition-colors"
        />
        <p className="text-xs text-notion-text-tertiary">
          Maximum length of the translation response
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-notion">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleTest}
          disabled={isTesting || isSaving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-notion-bg-secondary text-notion-text border border-notion-border rounded-notion hover:bg-notion-bg-tertiary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTesting ? (
            <Loader size={16} className="animate-spin" />
          ) : testStatus === 'success' ? (
            <Check size={16} className="text-green-600" />
          ) : testStatus === 'error' ? (
            <X size={16} className="text-red-600" />
          ) : null}
          <span className="text-sm font-medium">Test Connection</span>
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving || isTesting}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 notion-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader size={16} className="animate-spin" />
          ) : saveStatus === 'success' ? (
            <Check size={16} />
          ) : saveStatus === 'error' ? (
            <X size={16} />
          ) : null}
          <span className="text-sm font-medium">Save Settings</span>
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full px-4 py-2 text-sm text-notion-text-secondary hover:text-red-600 hover:bg-red-50 rounded-notion transition-colors"
      >
        Reset to Defaults
      </button>
    </div>
  );
};
