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
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
      }}
      aria-label="Translate with Thoth"
    >
      <Languages size={18} />
    </button>
  );
};
