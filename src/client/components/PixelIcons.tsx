import React from 'react';

interface PixelIconProps {
  type: 'health' | 'hunger' | 'cleanliness' | 'energy' | 'happiness' | 'feed' | 'play' | 'clean' | 'talk' | 'sleep' | 'restart';
  size?: number;
  className?: string;
}

export const PixelIcon: React.FC<PixelIconProps> = ({ type, size = 16, className = '' }) => {
  const getIconSVG = () => {
    const baseStyle = {
      width: size,
      height: size,
      imageRendering: 'pixelated' as const,
    };

    switch (type) {
      case 'health':
        return (
          <svg style={baseStyle} viewBox="0 0 16 16" className={className}>
            <rect x="4" y="2" width="3" height="3" fill="#ff4444"/>
            <rect x="9" y="2" width="3" height="3" fill="#ff4444"/>
            <rect x="2" y="5" width="12" height="3" fill="#ff4444"/>
            <rect x="3" y="8" width="10" height="3" fill="#ff4444"/>
            <rect x="5" y="11" width="6" height="2" fill="#ff4444"/>
            <rect x="7" y="13" width="2" height="1" fill="#ff4444"/>
          </svg>
        );

      case 'hunger':
        return (
          <svg style={baseStyle} viewBox="0 0 16 16" className={className}>
            {/* Burger */}
            <rect x="3" y="3" width="10" height="2" fill="#8b4513"/>
            <rect x="2" y="5" width="12" height="2" fill="#90EE90"/>
            <rect x="2" y="7" width="12" height="3" fill="#8b4513"/>
            <rect x="2" y="10" width="12" height="2" fill="#ff6b6b"/>
            <rect x="3" y="12" width="10" height="2" fill="#8b4513"/>
            <rect x="4" y="4" width="1" height="1" fill="#654321"/>
            <rect x="7" y="4" width="1" height="1" fill="#654321"/>
            <rect x="11" y="4" width="1" height="1" fill="#654321"/>
          </svg>
        );

      case 'cleanliness':
        return (
          <svg style={baseStyle} viewBox="0 0 16 16" className={className}>
            {/* Soap bubble */}
            <circle cx="8" cy="8" r="6" fill="#87ceeb" stroke="#4682b4" strokeWidth="1"/>
            <circle cx="6" cy="6" r="1" fill="#ffffff"/>
            <circle cx="10" cy="7" r="0.5" fill="#ffffff"/>
            <circle cx="7" cy="10" r="0.5" fill="#ffffff"/>
          </svg>
        );

      case 'energy':
        return (
          <svg style={baseStyle} viewBox="0 0 16 16" className={className}>
            {/* Lightning bolt */}
            <rect x="6" y="1" width="2" height="6" fill="#ffff00"/>
            <rect x="4" y="4" width="2" height="2" fill="#ffff00"/>
            <rect x="8" y="6" width="2" height="2" fill="#ffff00"/>
            <rect x="8" y="7" width="2" height="6" fill="#ffff00"/>
            <rect x="10" y="10" width="2" height="2" fill="#ffff00"/>
            <rect x="6" y="8" width="2" height="2" fill="#ffff00"/>
          </svg>
        );

      case 'happiness':
        return (
          <svg style={baseStyle} viewBox="0 0 16 16" className={className}>
            {/* Sun */}
            <circle cx="8" cy="8" r="4" fill="#ffd700"/>
            <rect x="7" y="1" width="2" height="2" fill="#ffd700"/>
            <rect x="7" y="13" width="2" height="2" fill="#ffd700"/>
            <rect x="1" y="7" width="2" height="2" fill="#ffd700"/>
            <rect x="13" y="7" width="2" height="2" fill="#ffd700"/>
            <rect x="3" y="3" width="1" height="1" fill="#ffd700"/>
            <rect x="12" y="3" width="1" height="1" fill="#ffd700"/>
            <rect x="3" y="12" width="1" height="1" fill="#ffd700"/>
            <rect x="12" y="12" width="1" height="1" fill="#ffd700"/>
          </svg>
        );

      case 'feed':
        return (
          <svg style={baseStyle} viewBox="0 0 16 16" className={className}>
            {/* Food bowl */}
            <rect x="2" y="8" width="12" height="6" fill="#8b4513"/>
            <rect x="3" y="9" width="10" height="4" fill="#f4e4bc"/>
            <rect x="4" y="6" width="2" height="2" fill="#ff6b6b"/>
            <rect x="7" y="5" width="2" height="3" fill="#90EE90"/>
            <rect x="10" y="6" width="2" height="2" fill="#ffff00"/>
          </svg>
        );

      case 'play':
        return (
          <svg style={baseStyle} viewBox="0 0 16 16" className={className}>
            {/* Game controller */}
            <rect x="2" y="6" width="12" height="6" fill="#654321"/>
            <rect x="3" y="7" width="10" height="4" fill="#8b4513"/>
            <rect x="5" y="8" width="1" height="1" fill="#f4e4bc"/>
            <rect x="5" y="10" width="1" height="1" fill="#f4e4bc"/>
            <rect x="4" y="9" width="1" height="1" fill="#f4e4bc"/>
            <rect x="6" y="9" width="1" height="1" fill="#f4e4bc"/>
            <rect x="10" y="8" width="1" height="1" fill="#ff4444"/>
            <rect x="11" y="9" width="1" height="1" fill="#4444ff"/>
          </svg>
        );

      case 'clean':
        return (
          <svg style={baseStyle} viewBox="0 0 16 16" className={className}>
            {/* Shower head */}
            <rect x="4" y="2" width="8" height="3" fill="#8b4513"/>
            <rect x="6" y="5" width="1" height="2" fill="#87ceeb"/>
            <rect x="8" y="6" width="1" height="3" fill="#87ceeb"/>
            <rect x="10" y="5" width="1" height="2" fill="#87ceeb"/>
            <rect x="5" y="8" width="1" height="2" fill="#87ceeb"/>
            <rect x="7" y="9" width="1" height="3" fill="#87ceeb"/>
            <rect x="9" y="8" width="1" height="2" fill="#87ceeb"/>
            <rect x="11" y="7" width="1" height="2" fill="#87ceeb"/>
          </svg>
        );

      case 'talk':
        return (
          <svg style={baseStyle} viewBox="0 0 16 16" className={className}>
            {/* Speech bubble */}
            <rect x="2" y="3" width="10" height="6" fill="#f4e4bc"/>
            <rect x="1" y="4" width="1" height="4" fill="#8b4513"/>
            <rect x="12" y="4" width="1" height="4" fill="#8b4513"/>
            <rect x="2" y="2" width="10" height="1" fill="#8b4513"/>
            <rect x="2" y="9" width="10" height="1" fill="#8b4513"/>
            <rect x="3" y="10" width="2" height="1" fill="#f4e4bc"/>
            <rect x="4" y="11" width="1" height="1" fill="#f4e4bc"/>
            <rect x="5" y="5" width="1" height="1" fill="#8b4513"/>
            <rect x="7" y="5" width="1" height="1" fill="#8b4513"/>
            <rect x="9" y="5" width="1" height="1" fill="#8b4513"/>
          </svg>
        );

      case 'sleep':
        return (
          <svg style={baseStyle} viewBox="0 0 16 16" className={className}>
            {/* Pillow */}
            <rect x="2" y="6" width="12" height="6" fill="#e6d4a8"/>
            <rect x="1" y="7" width="1" height="4" fill="#d4c49c"/>
            <rect x="14" y="7" width="1" height="4" fill="#d4c49c"/>
            <rect x="2" y="5" width="12" height="1" fill="#d4c49c"/>
            <rect x="2" y="12" width="12" height="1" fill="#d4c49c"/>
            <rect x="4" y="8" width="8" height="2" fill="#f4e4bc"/>
          </svg>
        );

      case 'restart':
        return (
          <svg style={baseStyle} viewBox="0 0 16 16" className={className}>
            {/* Restart arrow */}
            <rect x="7" y="2" width="2" height="6" fill="#8b4513"/>
            <rect x="5" y="4" width="2" height="2" fill="#8b4513"/>
            <rect x="9" y="4" width="2" height="2" fill="#8b4513"/>
            <rect x="3" y="6" width="2" height="2" fill="#8b4513"/>
            <rect x="11" y="6" width="2" height="2" fill="#8b4513"/>
            <rect x="4" y="8" width="8" height="2" fill="#8b4513"/>
            <rect x="6" y="10" width="4" height="2" fill="#8b4513"/>
            <rect x="7" y="12" width="2" height="2" fill="#8b4513"/>
          </svg>
        );

      default:
        return <div style={baseStyle} className={className}></div>;
    }
  };

  return getIconSVG();
};