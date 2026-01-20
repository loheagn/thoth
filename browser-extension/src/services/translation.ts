import type { TranslationRequest, TranslationResult } from '../types';

// Mock translations database
const mockTranslations: Record<string, string> = {
  'hello': '你好',
  'world': '世界',
  'thank you': '谢谢',
  'goodbye': '再见',
  'please': '请',
  'yes': '是',
  'no': '否',
  'help': '帮助',
  'book': '书',
  'computer': '计算机',
  'language': '语言',
  'translation': '翻译',
  'assistant': '助手',
  'reading': '阅读',
};

/**
 * Mock translation service
 * Simulates API call with delay
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
   * Translates text (mock implementation)
   */
  async translate(request: TranslationRequest): Promise<TranslationResult> {
    // Simulate network delay
    await this.delay(300 + Math.random() * 500);

    const text = request.text.toLowerCase().trim();
    
    // Look for exact match
    let translated = mockTranslations[text];
    
    // If no exact match, look for partial match
    if (!translated) {
      const partialMatch = Object.keys(mockTranslations).find(key => 
        text.includes(key) || key.includes(text)
      );
      if (partialMatch) {
        translated = mockTranslations[partialMatch];
      }
    }
    
    // Fallback to mock translation
    if (!translated) {
      translated = `[翻译: ${request.text}]`;
    }

    return {
      original: request.text,
      translated,
      detectedLanguage: 'en',
    };
  }

  /**
   * Helper to simulate async delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const translationService = TranslationService.getInstance();
