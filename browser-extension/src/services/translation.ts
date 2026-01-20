import type { TranslationRequest, TranslationResult } from '../types';
import { llmClient } from './llm';
import { configService } from './config';

/**
 * Translation service using LLM API
 */
export class TranslationService {
  private static instance: TranslationService;

  private constructor() {}

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  /**
   * Translates text using configured LLM API
   */
  async translate(request: TranslationRequest): Promise<TranslationResult> {
    try {
      // Check if API is configured
      const isConfigured = await configService.isConfigured();
      if (!isConfigured) {
        return {
          original: request.text,
          translated: '[Not configured] Please set up your API key in extension settings',
          detectedLanguage: 'en',
        };
      }

      // Translate using LLM API
      const translated = await llmClient.translate(request.text);

      return {
        original: request.text,
        translated,
        detectedLanguage: 'en',
      };
    } catch (error) {
      console.error('Translation error:', error);
      
      // Return user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Translation failed. Please check your settings.';

      return {
        original: request.text,
        translated: `[Error] ${errorMessage}`,
        detectedLanguage: 'en',
      };
    }
  }
}

export const translationService = TranslationService.getInstance();

