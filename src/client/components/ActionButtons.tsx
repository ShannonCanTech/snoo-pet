import React from 'react';
import { ActionType } from '../../shared/types/pet';

interface ActionButtonsProps {
  onAction: (action: ActionType) => void;
  onRestart: () => void;
  alive: boolean;
  disabled: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onAction, 
  onRestart, 
  alive, 
  disabled 
}) => {
  const actions: Array<{ action: ActionType; label: string; icon: string }> = [
    { action: 'feed', label: 'Feed', icon: '🍔' },
    { action: 'play', label: 'Play', icon: '🎮' },
    { action: 'clean', label: 'Clean', icon: '🧼' },
    { action: 'talk', label: 'Talk', icon: '💬' },
    { action: 'sleep', label: 'Sleep', icon: '🛏️' },
  ];

  const handleActionClick = (action: ActionType) => {
    if (disabled) return;
    onAction(action);
  };

  const handleRestartClick = () => {
    if (disabled) return;
    onRestart();
  };

  return (
    <div className="action-buttons-container">
      {/* Action Menu in LCD */}
      <div className={`action-menu ${alive ? 'six-buttons' : 'restart-mode'}`}>
        {alive ? (
          <>
            {actions.map(({ action, label, icon }) => (
              <div
                key={action}
                className={`action-item pixel-border ${disabled ? 'disabled' : ''}`}
                onClick={() => handleActionClick(action)}
              >
                <span className="action-icon">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
            {/* Restart Button - Always visible as 6th button when alive */}
            <div
              className={`action-item pixel-border restart-button ${disabled ? 'disabled' : ''}`}
              onClick={handleRestartClick}
            >
              <span className="action-icon">🔄</span>
              <span>Restart</span>
            </div>
          </>
        ) : (
          <div
            className={`action-item pixel-border restart-button ${disabled ? 'disabled' : ''}`}
            onClick={handleRestartClick}
          >
            <span className="action-icon">🔄</span>
            <span>Restart</span>
          </div>
        )}
      </div>
    </div>
  );
};