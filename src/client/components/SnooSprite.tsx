import React, { useState, useEffect } from 'react';
import { PetState } from '../../shared/types/pet';

interface SnooSpriteProps {
  state: PetState;
  className?: string;
  currentAction?: string;
}

export const SnooSprite: React.FC<SnooSpriteProps> = ({ 
  state, 
  className = '', 
  currentAction 
}) => {
  const [animationState, setAnimationState] = useState<string>('idle');
  const [showAnimation, setShowAnimation] = useState(false);

  // Handle action animations
  useEffect(() => {
    if (currentAction && currentAction !== 'idle') {
      setAnimationState(currentAction);
      setShowAnimation(true);
      
      // Reset animation after duration
      const duration = currentAction === 'sleep' ? 3000 : 2000;
      setTimeout(() => {
        setShowAnimation(false);
        setAnimationState('idle');
      }, duration);
    }
  }, [currentAction]);

  const getSnooPixelArt = () => {
    const isEating = animationState === 'feed' && showAnimation;
    const isPlaying = animationState === 'play' && showAnimation;
    const isCleaning = animationState === 'clean' && showAnimation;
    const isTalking = animationState === 'talk' && showAnimation;
    const isSleeping = animationState === 'sleep' && showAnimation || state === 'sleeping';
    const isDead = state === 'dead';

    return (
      <div className="pixel-snoo-container">
        {/* Snoo Character */}
        <div className={`pixel-snoo ${isEating ? 'eating' : ''} ${isPlaying ? 'playing' : ''}`}>
          {/* Antenna */}
          <div className="snoo-antenna"></div>
          <div className="snoo-antenna-ball"></div>
          
          {/* Head */}
          <div className="snoo-head">
            {/* Eyes */}
            <div className={`snoo-eye left ${isDead ? 'dead' : isSleeping ? 'sleeping' : ''}`}>
              {isDead ? '×' : isSleeping ? '' : '●'}
            </div>
            <div className={`snoo-eye right ${isDead ? 'dead' : isSleeping ? 'sleeping' : ''}`}>
              {isDead ? '×' : isSleeping ? '' : '●'}
            </div>
            
            {/* Mouth */}
            <div className={`snoo-mouth ${
              state === 'happy' ? 'happy' : 
              state === 'sick' ? 'sick' : 
              isEating ? 'eating' : 
              'normal'
            }`}>
              {isEating ? 'o' : state === 'happy' ? '‿' : state === 'sick' ? '⌒' : '‿'}
            </div>
          </div>
          
          {/* Body */}
          <div className="snoo-body"></div>
          
          {/* Arms (for playing animation) */}
          {isPlaying && (
            <>
              <div className="snoo-arm left playing"></div>
              <div className="snoo-arm right playing"></div>
            </>
          )}
        </div>

        {/* Animation Effects */}
        {/* Eating Animation - Food particles */}
        {isEating && (
          <div className="eating-effects">
            <div className="food-particle particle-1">🍔</div>
            <div className="food-particle particle-2">✨</div>
            <div className="food-particle particle-3">✨</div>
          </div>
        )}

        {/* Cleaning Animation - Bubbles */}
        {isCleaning && (
          <div className="cleaning-effects">
            <div className="bubble bubble-1">○</div>
            <div className="bubble bubble-2">○</div>
            <div className="bubble bubble-3">○</div>
            <div className="bubble bubble-4">○</div>
            <div className="bubble bubble-5">○</div>
          </div>
        )}

        {/* Talking Animation - Speech Bubble */}
        {isTalking && (
          <div className="talking-effects">
            <div className="speech-bubble">
              <div className="speech-text">Hi!</div>
            </div>
          </div>
        )}

        {/* Sleeping Animation - Z's */}
        {isSleeping && (
          <div className="sleeping-effects">
            <div className="sleep-z z-1">Z</div>
            <div className="sleep-z z-2">z</div>
            <div className="sleep-z z-3">z</div>
          </div>
        )}

        {/* Playing Animation - Game Controller */}
        {isPlaying && (
          <div className="playing-effects">
            <div className="game-controller">🎮</div>
            <div className="play-sparkle sparkle-1">★</div>
            <div className="play-sparkle sparkle-2">★</div>
          </div>
        )}
      </div>
    );
  };

  const getStateText = () => {
    if (showAnimation) {
      const actionTexts = {
        feed: 'EATING',
        play: 'PLAYING',
        clean: 'CLEANING',
        talk: 'TALKING',
        sleep: 'SLEEPING'
      };
      return actionTexts[animationState as keyof typeof actionTexts] || 'SNOO';
    }

    const stateTexts = {
      'happy': 'HAPPY',
      'sick': 'SICK', 
      'sleeping': 'SLEEPING',
      'dead': 'DEAD',
      'idle': 'IDLE'
    };
    
    return stateTexts[state] || 'SNOO';
  };

  return (
    <div className={`pet-display ${className}`}>
      {getSnooPixelArt()}
      <div className="pixel-text pet-state-text">
        SNOO - {getStateText()}
      </div>
    </div>
  );
};