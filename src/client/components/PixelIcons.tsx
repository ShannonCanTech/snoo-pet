import React from 'react';

interface PixelIconProps {
  type: 'health' | 'hunger' | 'cleanliness' | 'energy' | 'happiness' | 'feed' | 'play' | 'clean' | 'talk' | 'sleep' | 'restart';
  size?: number;
  className?: string;
}

export const PixelIcon: React.FC<PixelIconProps> = ({ type, size = 24, className = '' }) => {
  const getIconSVG = () => {
    const baseStyle = {
      width: size,
      height: size,
      imageRendering: 'pixelated' as const,
    };

    switch (type) {
      case 'health':
        return (
          <svg style={baseStyle} viewBox="0 0 24 24" className={className}>
            <rect x="6" y="3" width="4" height="4" fill="#ff4444"/>
            <rect x="14" y="3" width="4" height="4" fill="#ff4444"/>
            <rect x="3" y="7" width="18" height="4" fill="#ff4444"/>
            <rect x="4" y="11" width="16" height="4" fill="#ff4444"/>
            <rect x="6" y="15" width="12" height="3" fill="#ff4444"/>
            <rect x="8" y="18" width="8" height="2" fill="#ff4444"/>
            <rect x="10" y="20" width="4" height="1" fill="#ff4444"/>
          </svg>
        );

      case 'hunger':
        return (
          <svg style={baseStyle} viewBox="0 0 24 24" className={className}>
            {/* Burger */}
            <rect x="4" y="4" width="16" height="3" fill="#8b4513"/>
            <rect x="3" y="7" width="18" height="3" fill="#90EE90"/>
            <rect x="3" y="10" width="18" height="4" fill="#8b4513"/>
            <rect x="3" y="14" width="18" height="3" fill="#ff6b6b"/>
            <rect x="4" y="17" width="16" height="3" fill="#8b4513"/>
            <rect x="6" y="5" width="2" height="2" fill="#654321"/>
            <rect x="10" y="5" width="2" height="2" fill="#654321"/>
            <rect x="16" y="5" width="2" height="2" fill="#654321"/>
          </svg>
        );

      case 'cleanliness':
        return (
          <svg style={baseStyle} viewBox="0 0 24 24" className={className}>
            {/* Soap bubble */}
            <circle cx="12" cy="12" r="9" fill="#87ceeb" stroke="#4682b4" strokeWidth="2"/>
            <circle cx="9" cy="9" r="2" fill="#ffffff"/>
            <circle cx="15" cy="10" r="1" fill="#ffffff"/>
            <circle cx="10" cy="15" r="1" fill="#ffffff"/>
            <circle cx="16" cy="14" r="0.5" fill="#ffffff"/>
          </svg>
        );

      case 'energy':
        return (
          <svg style={baseStyle} viewBox="0 0 24 24" className={className}>
            {/* Lightning bolt */}
            <rect x="9" y="2" width="3" height="8" fill="#ffff00"/>
            <rect x="6" y="6" width="3" height="3" fill="#ffff00"/>
            <rect x="12" y="9" width="3" height="3" fill="#ffff00"/>
            <rect x="12" y="10" width="3" height="8" fill="#ffff00"/>
            <rect x="15" y="14" width="3" height="3" fill="#ffff00"/>
            <rect x="9" y="12" width="3" height="3" fill="#ffff00"/>
            <rect x="6" y="4" width="2" height="2" fill="#ffff00"/>
            <rect x="16" y="16" width="2" height="2" fill="#ffff00"/>
          </svg>
        );

      case 'happiness':
        return (
          <svg style={baseStyle} viewBox="0 0 24 24" className={className}>
            {/* Sun */}
            <circle cx="12" cy="12" r="6" fill="#ffd700"/>
            <rect x="11" y="1" width="2" height="3" fill="#ffd700"/>
            <rect x="11" y="20" width="2" height="3" fill="#ffd700"/>
            <rect x="1" y="11" width="3" height="2" fill="#ffd700"/>
            <rect x="20" y="11" width="3" height="2" fill="#ffd700"/>
            <rect x="4" y="4" width="2" height="2" fill="#ffd700"/>
            <rect x="18" y="4" width="2" height="2" fill="#ffd700"/>
            <rect x="4" y="18" width="2" height="2" fill="#ffd700"/>
            <rect x="18" y="18" width="2" height="2" fill="#ffd700"/>
          </svg>
        );

      case 'feed':
        return (
          <svg style={baseStyle} viewBox="0 0 24 24" className={className}>
            {/* Food bowl */}
            <rect x="3" y="12" width="18" height="8" fill="#8b4513"/>
            <rect x="4" y="13" width="16" height="6" fill="#f4e4bc"/>
            <rect x="6" y="9" width="3" height="3" fill="#ff6b6b"/>
            <rect x="10" y="7" width="3" height="5" fill="#90EE90"/>
            <rect x="15" y="9" width="3" height="3" fill="#ffff00"/>
          </svg>
        );

      case 'play':
        return (
          <svg style={baseStyle} viewBox="0 0 24 24" className={className}>
            {/* Game controller */}
            <rect x="3" y="9" width="18" height="8" fill="#654321"/>
            <rect x="4" y="10" width="16" height="6" fill="#8b4513"/>
            <rect x="7" y="12" width="2" height="2" fill="#f4e4bc"/>
            <rect x="7" y="15" width="2" height="2" fill="#f4e4bc"/>
            <rect x="6" y="13" width="2" height="2" fill="#f4e4bc"/>
            <rect x="8" y="13" width="2" height="2" fill="#f4e4bc"/>
            <rect x="15" y="12" width="2" height="2" fill="#ff4444"/>
            <rect x="17" y="13" width="2" height="2" fill="#4444ff"/>
          </svg>
        );

      case 'clean':
        return (
          <svg style={baseStyle} viewBox="0 0 24 24" className={className}>
            {/* Shower head */}
            <rect x="6" y="3" width="12" height="4" fill="#8b4513"/>
            <rect x="9" y="7" width="2" height="3" fill="#87ceeb"/>
            <rect x="12" y="8" width="2" height="4" fill="#87ceeb"/>
            <rect x="15" y="7" width="2" height="3" fill="#87ceeb"/>
            <rect x="7" y="12" width="2" height="3" fill="#87ceeb"/>
            <rect x="10" y="13" width="2" height="4" fill="#87ceeb"/>
            <rect x="13" y="12" width="2" height="3" fill="#87ceeb"/>
            <rect x="16" y="10" width="2" height="3" fill="#87ceeb"/>
          </svg>
        );

      case 'talk':
        return (
          <svg style={baseStyle} viewBox="0 0 24 24" className={className}>
            {/* Speech bubble */}
            <rect x="3" y="4" width="15" height="9" fill="#f4e4bc"/>
            <rect x="2" y="6" width="2" height="5" fill="#8b4513"/>
            <rect x="18" y="6" width="2" height="5" fill="#8b4513"/>
            <rect x="3" y="3" width="15" height="2" fill="#8b4513"/>
            <rect x="3" y="13" width="15" height="2" fill="#8b4513"/>
            <rect x="4" y="15" width="3" height="2" fill="#f4e4bc"/>
            <rect x="6" y="17" width="2" height="2" fill="#f4e4bc"/>
            <rect x="7" y="7" width="2" height="2" fill="#8b4513"/>
            <rect x="10" y="7" width="2" height="2" fill="#8b4513"/>
            <rect x="13" y="7" width="2" height="2" fill="#8b4513"/>
          </svg>
        );

      case 'sleep':
        return (
          <svg style={baseStyle} viewBox="0 0 24 24" className={className}>
            {/* Pillow */}
            <rect x="3" y="9" width="18" height="8" fill="#e6d4a8"/>
            <rect x="2" y="10" width="2" height="6" fill="#d4c49c"/>
            <rect x="20" y="10" width="2" height="6" fill="#d4c49c"/>
            <rect x="3" y="8" width="18" height="2" fill="#d4c49c"/>
            <rect x="3" y="17" width="18" height="2" fill="#d4c49c"/>
            <rect x="6" y="12" width="12" height="3" fill="#f4e4bc"/>
          </svg>
        );

      case 'restart':
        return (
          <svg style={baseStyle} viewBox="0 0 24 24" className={className}>
            {/* Restart arrow */}
            <rect x="10" y="3" width="3" height="8" fill="#8b4513"/>
            <rect x="7" y="6" width="3" height="3" fill="#8b4513"/>
            <rect x="13" y="6" width="3" height="3" fill="#8b4513"/>
            <rect x="4" y="9" width="3" height="3" fill="#8b4513"/>
            <rect x="16" y="9" width="3" height="3" fill="#8b4513"/>
            <rect x="6" y="12" width="12" height="3" fill="#8b4513"/>
            <rect x="9" y="15" width="6" height="3" fill="#8b4513"/>
            <rect x="10" y="18" width="3" height="3" fill="#8b4513"/>
          </svg>
        );

      default:
        return <div style={baseStyle} className={className}></div>;
    }
  };

  return getIconSVG();
};