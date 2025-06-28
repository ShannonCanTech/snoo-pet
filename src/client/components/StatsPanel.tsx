import React from 'react';
import { PetStats } from '../../shared/types/pet';
import { PixelIcon } from './PixelIcons';

interface StatsPanelProps {
  stats: PetStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const formatStatValue = (value: number) => {
    return Math.round(value).toString();
  };

  const statItems = [
    { key: 'health', label: 'Health', value: stats.health, iconType: 'health' as const },
    { key: 'hunger', label: 'Hunger', value: stats.hunger, iconType: 'hunger' as const },
    { key: 'cleanliness', label: 'Cleanliness', value: stats.cleanliness, iconType: 'cleanliness' as const },
    { key: 'energy', label: 'Energy', value: stats.energy, iconType: 'energy' as const },
    { key: 'happiness', label: 'Happiness', value: stats.happiness, iconType: 'happiness' as const },
  ];

  return (
    <div className="stats-grid pixel-text">
      {statItems.map(({ key, label, value, iconType }) => (
        <div key={key} className="stat-item">
          <span className="stat-icon">
            <PixelIcon type={iconType} size={20} />
          </span>
          <span className="stat-text">{label}: {formatStatValue(value)}</span>
        </div>
      ))}

      <div className="stat-item age-stat">
        <span>Age: {Math.round(stats.age)} min</span>
      </div>
    </div>
  );
};