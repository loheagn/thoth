import React, { useEffect, useState } from 'react';
import { Book, Trash2, RefreshCw } from 'lucide-react';
import { VocabularyList } from '../components/VocabularyList';
import { useVocabularyStore } from '../store/vocabulary';
import '../index.css';

export const Popup: React.FC = () => {
  const { words, isLoading, error, loadWords, deleteWord, clearAll, refresh } = useVocabularyStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const handleClearAll = async () => {
    if (showClearConfirm) {
      await clearAll();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  return (
    <div className="w-[400px] h-[600px] flex flex-col bg-notion-bg">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-notion-border p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-notion-accent rounded-lg flex items-center justify-center">
              <Book size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-semibold text-notion-text">Thoth</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={refresh}
              disabled={isLoading}
              className="p-2 hover:bg-notion-bg-secondary rounded-notion transition-colors disabled:opacity-50"
              aria-label="Refresh"
            >
              <RefreshCw size={16} className={`text-notion-text-secondary ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            {words.length > 0 && (
              <button
                onClick={handleClearAll}
                className={`p-2 hover:bg-red-50 rounded-notion transition-colors ${
                  showClearConfirm ? 'bg-red-50 text-red-600' : 'text-notion-text-secondary'
                }`}
                aria-label="Clear all"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-notion-text-secondary">
            {words.length} {words.length === 1 ? 'word' : 'words'} saved
          </p>
          {showClearConfirm && (
            <p className="text-xs text-red-600 font-medium animate-pulse">
              Click again to confirm
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-notion">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-notion-accent border-t-transparent"></div>
          </div>
        ) : (
          <VocabularyList words={words} onDelete={deleteWord} />
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-notion-border p-3">
        <p className="text-xs text-center text-notion-text-tertiary">
          Select text on any page to translate
        </p>
      </div>
    </div>
  );
};
