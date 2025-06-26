import React from 'react';
import { PetStats } from '../../shared/types/pet';

interface StatsPanelProps {
  stats: PetStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const formatStatValue = (value: number) => {
    return Math.round(value).toString();
  };

  const getStatIcon = (statName: string) => {
    const icons = {
      health: '♥',
      hunger: '🍔',
      cleanliness: '🧼',
      energy: '⚡',
      happiness: '😊'
    };
    return icons[statName as keyof typeof icons] || '●';
  };

  return (
    <div className="stats-grid pixel-text">
      <div className="stat-item">
        <span>♥ Health: {formatStatValue(stats.health)}</span>
      </div>

      <div className="stat-item">
        <span>🍔 Hunger: {formatStatValue(stats.hunger)}</span>
      </div>

      <div className="stat-item">
        <span>🧼 Cleanliness: {formatStatValue(stats.cleanliness)}</span>
      </div>

      <div className="stat-item">
        <span>⚡ Energy: {formatStatValue(stats.energy)}</span>
      </div>

      <div className="stat-item">
        <span>😊 Happiness: {formatStatValue(stats.happiness)}</span>
      </div>

      <div className="stat-item">
        <span>Age: {Math.round(stats.age)} min</span>
      </div>
    </div>
  );
};