import { create } from 'zustand';
import type { VocabularyWord } from '../types';
import { storageService } from '../services/storage';

interface VocabularyStore {
  words: VocabularyWord[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadWords: () => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useVocabularyStore = create<VocabularyStore>((set, get) => ({
  words: [],
  isLoading: false,
  error: null,

  loadWords: async () => {
    set({ isLoading: true, error: null });
    try {
      const words = await storageService.getVocabulary();
      set({ words, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load vocabulary',
        isLoading: false 
      });
    }
  },

  deleteWord: async (id: string) => {
    try {
      await storageService.deleteWord(id);
      set({ words: get().words.filter(word => word.id !== id) });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete word' });
    }
  },

  clearAll: async () => {
    try {
      await storageService.clearVocabulary();
      set({ words: [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to clear vocabulary' });
    }
  },

  refresh: async () => {
    await get().loadWords();
  },
}));
