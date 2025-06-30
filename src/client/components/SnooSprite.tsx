import React, { useState, useEffect } from 'react';
import { PetState } from '../../shared/types/pet';

interface SnooSpriteProps {
  state: PetState;
  className?: string;
  currentAction?: string;
  message?: string;
}

export const SnooSprite: React.FC<SnooSpriteProps> = ({ 
  state, 
  className = '', 
  currentAction,
  message 
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
    const isHappy = state === 'happy' && !showAnimation;

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

        {/* Enhanced Animation Effects */}
        
        {/* Eating Animation - Enhanced with multiple food items */}
        {isEating && (
          <div className="eating-effects">
            <div className="food-particle particle-1">
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="2" y="2" width="8" height="2" fill="#8b4513"/>
                <rect x="1" y="4" width="10" height="2" fill="#90EE90"/>
                <rect x="1" y="6" width="10" height="2" fill="#8b4513"/>
                <rect x="1" y="8" width="10" height="2" fill="#ff6b6b"/>
              </svg>
            </div>
            <div className="food-particle particle-2">✨</div>
            <div className="food-particle particle-3">✨</div>
            <div className="satisfaction-sparkle sparkle-1">★</div>
            <div className="satisfaction-sparkle sparkle-2">★</div>
          </div>
        )}

        {/* Enhanced Cleaning Animation - Shower head with bubbles */}
        {isCleaning && (
          <div className="cleaning-effects">
            <div className="shower-head">
              <svg width="24" height="16" viewBox="0 0 24 16">
                <rect x="4" y="2" width="16" height="6" fill="#8b4513"/>
                <rect x="6" y="8" width="2" height="4" fill="#87ceeb"/>
                <rect x="10" y="9" width="2" height="5" fill="#87ceeb"/>
                <rect x="14" y="8" width="2" height="4" fill="#87ceeb"/>
                <rect x="18" y="9" width="2" height="3" fill="#87ceeb"/>
              </svg>
            </div>
            <div className="bubble bubble-1">○</div>
            <div className="bubble bubble-2">○</div>
            <div className="bubble bubble-3">○</div>
            <div className="bubble bubble-4">○</div>
            <div className="bubble bubble-5">○</div>
            <div className="cleaning-sparkle sparkle-1">✨</div>
            <div className="cleaning-sparkle sparkle-2">✨</div>
          </div>
        )}

        {/* Enhanced Talking Animation - Multiple speech bubbles */}
        {isTalking && (
          <div className="talking-effects">
            <div className="speech-bubble main-bubble">
              <div className="speech-text">Hi!</div>
            </div>
            <div className="speech-bubble small-bubble bubble-1">
              <div className="speech-text">♪</div>
            </div>
            <div className="speech-bubble small-bubble bubble-2">
              <div className="speech-text">♫</div>
            </div>
            <div className="communication-sparkle sparkle-1">💫</div>
            <div className="communication-sparkle sparkle-2">💫</div>
          </div>
        )}

        {/* Enhanced Sleeping Animation - Z's with pillow */}
        {isSleeping && (
          <div className="sleeping-effects">
            <div className="pillow">
              <svg width="20" height="8" viewBox="0 0 20 8">
                <rect x="0" y="2" width="20" height="6" fill="#e6d4a8"/>
                <rect x="2" y="4" width="16" height="2" fill="#f4e4bc"/>
              </svg>
            </div>
            <div className="sleep-z z-1">Z</div>
            <div className="sleep-z z-2">z</div>
            <div className="sleep-z z-3">z</div>
          </div>
        )}

        {/* Enhanced Playing Animation - Game controller with effects */}
        {isPlaying && (
          <div className="playing-effects">
            <div className="game-controller">
              <svg width="20" height="12" viewBox="0 0 20 12">
                <rect x="2" y="3" width="16" height="6" fill="#654321"/>
                <rect x="3" y="4" width="14" height="4" fill="#8b4513"/>
                <rect x="5" y="5" width="1" height="1" fill="#f4e4bc"/>
                <rect x="5" y="7" width="1" height="1" fill="#f4e4bc"/>
                <rect x="4" y="6" width="1" height="1" fill="#f4e4bc"/>
                <rect x="6" y="6" width="1" height="1" fill="#f4e4bc"/>
                <rect x="13" y="5" width="1" height="1" fill="#ff4444"/>
                <rect x="14" y="6" width="1" height="1" fill="#4444ff"/>
              </svg>
            </div>
            <div className="play-sparkle sparkle-1">★</div>
            <div className="play-sparkle sparkle-2">★</div>
            <div className="play-sparkle sparkle-3">✦</div>
            <div className="play-sparkle sparkle-4">✦</div>
          </div>
        )}

        {/* Happy State Animation - Rainbow and sun */}
        {isHappy && (
          <div className="happy-effects">
            <div className="rainbow">
              <svg width="60" height="30" viewBox="0 0 60 30">
                <path d="M5 25 Q30 5 55 25" stroke="#ff0000" strokeWidth="2" fill="none"/>
                <path d="M7 23 Q30 7 53 23" stroke="#ff8800" strokeWidth="2" fill="none"/>
                <path d="M9 21 Q30 9 51 21" stroke="#ffff00" strokeWidth="2" fill="none"/>
                <path d="M11 19 Q30 11 49 19" stroke="#00ff00" strokeWidth="2" fill="none"/>
                <path d="M13 17 Q30 13 47 17" stroke="#0088ff" strokeWidth="2" fill="none"/>
                <path d="M15 15 Q30 15 45 15" stroke="#8800ff" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div className="happy-sparkle sparkle-1">✨</div>
            <div className="happy-sparkle sparkle-2">✨</div>
            <div className="happy-sparkle sparkle-3">⭐</div>
          </div>
        )}

        {/* Health Recovery Animation */}
        {state === 'sick' && !showAnimation && (
          <div className="health-effects">
            <div className="health-heart heart-1">
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="2" y="1" width="2" height="2" fill="#ff4444"/>
                <rect x="6" y="1" width="2" height="2" fill="#ff4444"/>
                <rect x="1" y="3" width="8" height="2" fill="#ff4444"/>
                <rect x="2" y="5" width="6" height="2" fill="#ff4444"/>
                <rect x="3" y="7" width="4" height="1" fill="#ff4444"/>
                <rect x="4" y="8" width="2" height="1" fill="#ff4444"/>
              </svg>
            </div>
            <div className="health-heart heart-2">
              <svg width="8" height="8" viewBox="0 0 8 8">
                <rect x="1" y="1" width="1" height="1" fill="#ff4444"/>
                <rect x="4" y="1" width="1" height="1" fill="#ff4444"/>
                <rect x="0" y="2" width="6" height="1" fill="#ff4444"/>
                <rect x="1" y="3" width="4" height="1" fill="#ff4444"/>
                <rect x="2" y="4" width="2" height="1" fill="#ff4444"/>
              </svg>
            </div>
            <div className="healing-aura"></div>
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
      {/* Action message display below pet state text */}
      {message && (
        <div className="pixel-text snoo-message-display">
          {message}
        </div>
      )}
    </div>
  );
};