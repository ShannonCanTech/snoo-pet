import React from 'react';
import { ActionType } from '../../shared/types/pet';
import { PixelIcon } from './PixelIcons';

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
  const actions: Array<{ action: ActionType; label: string; iconType: any }> = [
    { action: 'feed', label: 'Feed', iconType: 'feed' },
    { action: 'play', label: 'Play', iconType: 'play' },
    { action: 'clean', label: 'Clean', iconType: 'clean' },
    { action: 'talk', label: 'Talk', iconType: 'talk' },
    { action: 'sleep', label: 'Sleep', iconType: 'sleep' },
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
            {actions.map(({ action, label, iconType }) => (
              <div
                key={action}
                className={`action-item pixel-border ${disabled ? 'disabled' : ''}`}
                onClick={() => handleActionClick(action)}
              >
                <span className="action-icon">
                  <PixelIcon type={iconType} size={32} />
                </span>
                <span>{label}</span>
              </div>
            ))}
            {/* Restart Button - Always visible as 6th button when alive */}
            <div
              className={`action-item pixel-border restart-button ${disabled ? 'disabled' : ''}`}
              onClick={handleRestartClick}
            >
              <span className="action-icon">
                <PixelIcon type="restart" size={32} />
              </span>
              <span>Restart</span>
            </div>
          </>
        ) : (
          <div
            className={`action-item pixel-border restart-button ${disabled ? 'disabled' : ''}`}
            onClick={handleRestartClick}
          >
            <span className="action-icon">
              <PixelIcon type="restart" size={32} />
            </span>
            <span>Restart</span>
          </div>
        )}
      </div>
    </div>
  );
};