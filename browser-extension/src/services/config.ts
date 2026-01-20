import type { TranslationConfig } from '../types';

const CONFIG_STORAGE_KEY = 'thoth_translation_config';

const DEFAULT_CONFIG: TranslationConfig = {
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  model: 'gpt-3.5-turbo',
  temperature: 0.3,
  maxTokens: 500,
};

/**
 * Configuration service for managing translation API settings
 */
export class ConfigService {
  private static instance: ConfigService;
  private cachedConfig: TranslationConfig | null = null;

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Get translation configuration
   */
  async getConfig(): Promise<TranslationConfig> {
    if (this.cachedConfig) {
      return this.cachedConfig;
    }

    try {
      const result = await chrome.storage.local.get(CONFIG_STORAGE_KEY);
      const config = (result[CONFIG_STORAGE_KEY] as TranslationConfig) || DEFAULT_CONFIG;
      this.cachedConfig = config;
      return config;
    } catch (error) {
      console.error('Error getting config:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Save translation configuration
   */
  async saveConfig(config: TranslationConfig): Promise<void> {
    try {
      await chrome.storage.local.set({ [CONFIG_STORAGE_KEY]: config });
      this.cachedConfig = config;
    } catch (error) {
      console.error('Error saving config:', error);
      throw new Error('Failed to save configuration');
    }
  }

  /**
   * Reset configuration to defaults
   */
  async resetConfig(): Promise<void> {
    await this.saveConfig(DEFAULT_CONFIG);
  }

  /**
   * Check if API is configured
   */
  async isConfigured(): Promise<boolean> {
    const config = await this.getConfig();
    return config.apiKey.trim().length > 0;
  }

  /**
   * Clear cached config (useful for testing)
   */
  clearCache(): void {
    this.cachedConfig = null;
  }
}

export const configService = ConfigService.getInstance();
