import React from 'react';
import { Languages } from 'lucide-react';

interface FloatingIconProps {
  position: { x: number; y: number };
  onClick: () => void;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({ position, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed z-[9999] bg-notion-accent hover:bg-notion-accent-hover text-white rounded-full p-2 shadow-notion-lg transition-all hover:scale-110 animate-in fade-in zoom-in-50 duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      aria-label="Translate with Thoth"
    >
      <Languages size={18} />
    </button>
  );
};
