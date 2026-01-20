import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import type { VocabularyWord } from '../types';

interface VocabularyListProps {
  words: VocabularyWord[];
  onDelete: (id: string) => void;
}

export const VocabularyList: React.FC<VocabularyListProps> = ({ words, onDelete }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
  };

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-notion-bg-secondary flex items-center justify-center">
          <svg
            className="w-8 h-8 text-notion-text-tertiary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-notion-text mb-1">No vocabulary yet</h3>
        <p className="text-xs text-notion-text-secondary">
          Select text on any webpage and save translations to build your vocabulary.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-notion-border">
      {words.map((word) => (
        <div
          key={word.id}
          className="p-3 hover:bg-notion-bg-secondary transition-colors group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <h4 className="text-sm font-semibold text-notion-text truncate">
                  {word.word}
                </h4>
                <span className="text-xs text-notion-text-tertiary shrink-0">
                  {formatDate(word.timestamp)}
                </span>
              </div>
              <p className="text-base text-notion-text font-medium mb-2">
                {word.translation}
              </p>
              {word.context && (
                <p className="text-xs text-notion-text-secondary italic truncate mb-1">
                  "{word.context}"
                </p>
              )}
              {word.sourceUrl && (
                <a
                  href={word.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-notion-accent hover:text-notion-accent-hover transition-colors"
                >
                  <ExternalLink size={12} />
                  <span className="truncate max-w-[200px]">
                    {new URL(word.sourceUrl).hostname}
                  </span>
                </a>
              )}
            </div>
            <button
              onClick={() => onDelete(word.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 hover:text-red-600 rounded text-notion-text-tertiary"
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
