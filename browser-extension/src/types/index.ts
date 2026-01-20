export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  context?: string;
  sourceUrl?: string;
  timestamp: number;
}

export interface TranslationResult {
  original: string;
  translated: string;
  detectedLanguage?: string;
}

export interface TranslationRequest {
  text: string;
  targetLanguage?: string;
}

export interface SelectionInfo {
  text: string;
  x: number;
  y: number;
}

export interface TranslationConfig {
  apiEndpoint: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface LLMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: LLMMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
