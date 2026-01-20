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
      console.error('[Thoth] Error saving word:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="popover"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 10000,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3>Translation</h3>
        <button
          onClick={onClose}
          className="close-btn"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Original Text */}
      <div style={{ marginBottom: '12px' }}>
        <label>Original</label>
        <p style={{ fontWeight: 500 }}>{result.original}</p>
      </div>

      {/* Translated Text */}
      <div style={{ marginBottom: '16px' }}>
        <label>Translation</label>
        <p className="translation">{result.translated}</p>
      </div>

      {/* Actions */}
      <div className="actions">
        <button
          onClick={handleSave}
          disabled={isSaved || isSaving}
          className={`btn ${isSaved ? 'btn-saved' : 'btn-primary'}`}
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
