import React, { useState } from 'react';
import { X, BookmarkPlus, Check } from 'lucide-react';
import type { TranslationResult } from '../types';

interface TranslationPopoverProps {
  result: TranslationResult;
  position: { x: number; y: number };
  onClose: () => void;
  onSave: (word: string, translation: string) => Promise<void>;
}

export const TranslationPopover: React.FC<TranslationPopoverProps> = ({
  result,
  position,
  onClose,
  onSave,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaved || isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave(result.original, result.translated);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving word:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="notion-card fixed z-[10000] w-80 p-4 shadow-notion-lg animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-notion-text">Translation</h3>
        <button
          onClick={onClose}
          className="text-notion-text-tertiary hover:text-notion-text transition-colors p-1 -m-1"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Original Text */}
      <div className="mb-3">
        <p className="text-xs text-notion-text-secondary mb-1">Original</p>
        <p className="text-sm text-notion-text font-medium">{result.original}</p>
      </div>

      {/* Translated Text */}
      <div className="mb-4">
        <p className="text-xs text-notion-text-secondary mb-1">Translation</p>
        <p className="text-base text-notion-text font-semibold">{result.translated}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaved || isSaving}
          className={`
            flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-notion text-sm font-medium transition-all
            ${isSaved 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'notion-button-primary hover:shadow-sm'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isSaved ? (
            <>
              <Check size={16} />
              Saved
            </>
          ) : (
            <>
              <BookmarkPlus size={16} />
              Save to Vocabulary
            </>
          )}
        </button>
      </div>
    </div>
  );
};
