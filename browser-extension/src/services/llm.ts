import type { LLMRequest, LLMResponse, LLMMessage } from '../types';
import { configService } from './config';

/**
 * Translation prompt template
 * Translates English text to Chinese with context awareness
 */
const TRANSLATION_SYSTEM_PROMPT = `You are a professional translator specializing in English to Chinese translation. Your task is to:

1. Translate the given English text to natural, fluent Chinese
2. Preserve the original meaning and tone
3. Consider context when available
4. For technical terms, use commonly accepted Chinese translations
5. For proper nouns, keep the original or use standard Chinese transliterations

Respond ONLY with the Chinese translation, no explanations or additional text.`;

/**
 * LLM API client for OpenAI-compatible endpoints
 */
export class LLMClient {
  private static instance: LLMClient;

  private constructor() {}

  static getInstance(): LLMClient {
    if (!LLMClient.instance) {
      LLMClient.instance = new LLMClient();
    }
    return LLMClient.instance;
  }

  /**
   * Translate text using LLM API
   */
  async translate(text: string, context?: string): Promise<string> {
    const config = await configService.getConfig();

    if (!config.apiKey) {
      throw new Error('API key not configured. Please configure your translation API in settings.');
    }

    const userPrompt = context
      ? `Translate the following English text to Chinese.\n\nContext: ${context}\n\nText to translate: ${text}`
      : `Translate the following English text to Chinese: ${text}`;

    const messages: LLMMessage[] = [
      { role: 'system', content: TRANSLATION_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    const request: LLMRequest = {
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    };

    try {
      const response = await this.makeRequest(config.apiEndpoint, config.apiKey, request);
      return this.extractTranslation(response);
    } catch (error) {
      console.error('Translation API error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to translate text. Please check your API configuration.');
    }
  }

  /**
   * Make HTTP request to LLM API
   */
  private async makeRequest(
    endpoint: string,
    apiKey: string,
    request: LLMRequest
  ): Promise<LLMResponse> {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch {
        // Use default error message
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data as LLMResponse;
  }

  /**
   * Extract translation from LLM response
   */
  private extractTranslation(response: LLMResponse): string {
    if (!response.choices || response.choices.length === 0) {
      throw new Error('No translation returned from API');
    }

    const message = response.choices[0].message;
    if (!message || !message.content) {
      throw new Error('Invalid response format from API');
    }

    return message.content.trim();
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.translate('hello');
      return true;
    } catch (error) {
      console.error('API test failed:', error);
      return false;
    }
  }
}

export const llmClient = LLMClient.getInstance();
