import type { VocabularyWord } from '../types';

const STORAGE_KEY = 'thoth_vocabulary';

/**
 * Storage service for managing vocabulary words using chrome.storage.local
 */
export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Get all saved vocabulary words
   */
  async getVocabulary(): Promise<VocabularyWord[]> {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      return (result[STORAGE_KEY] as VocabularyWord[]) || [];
    } catch (error) {
      console.error('Error getting vocabulary:', error);
      return [];
    }
  }

  /**
   * Save a new vocabulary word
   */
  async saveWord(word: Omit<VocabularyWord, 'id' | 'timestamp'>): Promise<VocabularyWord> {
    const vocabulary = await this.getVocabulary();
    
    const newWord: VocabularyWord = {
      ...word,
      id: this.generateId(),
      timestamp: Date.now(),
    };

    vocabulary.unshift(newWord);
    await chrome.storage.local.set({ [STORAGE_KEY]: vocabulary });
    
    return newWord;
  }

  /**
   * Delete a vocabulary word by ID
   */
  async deleteWord(id: string): Promise<void> {
    const vocabulary = await this.getVocabulary();
    const filtered = vocabulary.filter(word => word.id !== id);
    await chrome.storage.local.set({ [STORAGE_KEY]: filtered });
  }

  /**
   * Clear all vocabulary words
   */
  async clearVocabulary(): Promise<void> {
    await chrome.storage.local.remove(STORAGE_KEY);
  }

  /**
   * Check if a word already exists in vocabulary
   */
  async wordExists(word: string): Promise<boolean> {
    const vocabulary = await this.getVocabulary();
    return vocabulary.some(w => w.word.toLowerCase() === word.toLowerCase());
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const storageService = StorageService.getInstance();
