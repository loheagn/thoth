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
