import React, { useState, useEffect, useCallback } from 'react';
import { navigateTo } from '@devvit/client';
import boltBadge from '../../assets/bolt-badge.png';
import { SnooSprite } from './components/SnooSprite';
import { StatsPanel } from './components/StatsPanel';
import { ActionButtons } from './components/ActionButtons';
import { CommunityFeed } from './components/CommunityFeed';
import { PetStats, PetState, ActionType } from '../shared/types/pet';
import packageJson from '../../package.json';
import './styles/retro.css';

const INITIAL_STATS: PetStats = {
  health: 100,
  hunger: 100,
  cleanliness: 100,
  energy: 100,
  happiness: 100,
  age: 0,
};

const DECAY_RATE = {
  hunger: 3,
  cleanliness: 2,
  energy: 2.5,
  happiness: 1.5,
};

function extractSubredditName(): string | null {
  const devCommand = packageJson.scripts?.['dev:devvit'];
  if (!devCommand || !devCommand.includes('devvit playtest')) {
    return null;
  }
  const argsMatch = devCommand.match(/devvit\s+playtest\s+(.*)/);
  if (!argsMatch || !argsMatch[1]) {
    return null;
  }
  const args = argsMatch[1].trim().split(/\s+/);
  const subreddit = args.find((arg) => !arg.startsWith('-'));
  return subreddit || null;
}

const Banner = () => {
  const subreddit = extractSubredditName();
  if (!subreddit) {
    return (
      <div className="w-full bg-red-600 text-white p-4 text-center mb-4 pixel-font">
        Please visit your playtest subreddit to play with full Reddit integration.
      </div>
    );
  }

  const subredditUrl = `https://www.reddit.com/r/${subreddit}`;

  return (
    <div className="w-full bg-red-600 text-white p-4 text-center mb-4 pixel-font">
      Visit{' '}
      <a
        href={subredditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-bold"
      >
        r/{subreddit}
      </a>{' '}
      for full Reddit integration! Create a post from the three dots menu.
    </div>
  );
};

export const Game: React.FC = () => {
  const [stats, setStats] = useState<PetStats>(INITIAL_STATS);
  const [petState, setPetState] = useState<PetState>('idle');
  const [currentAction, setCurrentAction] = useState<string>('idle');
  const [alive, setAlive] = useState(true);
  const [message, setMessage] = useState('');
  const [actionCount, setActionCount] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [birthTime] = useState(Date.now());

  useEffect(() => {
    const hostname = window.location.hostname;
    setShowBanner(!hostname.endsWith('devvit.net'));
  }, []);

  // Load shared pet state from server
  useEffect(() => {
    const loadSharedState = async () => {
      try {
        const response = await fetch('/api/pet-state');
        if (response.ok) {
          const data = await response.json();
          if (data.stats) {
            setStats(data.stats);
            updatePetState(data.stats);
            setAlive(data.alive !== false);
          }
        }
      } catch (error) {
        console.error('Failed to load shared state:', error);
      }
    };

    loadSharedState();
    
    // Poll for updates every 15 seconds to sync with other users
    const interval = setInterval(loadSharedState, 15000);
    return () => clearInterval(interval);
  }, []);

  const showMessage = useCallback((msg: string, duration = 2000) => {
    setMessage(msg);
    if (duration > 0) {
      setTimeout(() => setMessage(''), duration);
    }
  }, []);

  const sendRedditUpdate = useCallback(async (action: string, messageText: string) => {
    try {
      await fetch('/api/reddit-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, message: messageText }),
      });
    } catch (error) {
      console.error('Failed to send Reddit update:', error);
    }
  }, []);

  const updatePetState = useCallback((newStats: PetStats) => {
    if (newStats.health <= 0 || newStats.hunger <= 0 || newStats.cleanliness <= 0 || newStats.energy <= 0) {
      setPetState('dead');
      setAlive(false);
      return;
    }

    if (newStats.energy <= 20) {
      setPetState('sleeping');
    } else if (newStats.health <= 30 || newStats.hunger <= 20 || newStats.cleanliness <= 20) {
      setPetState('sick');
    } else if (newStats.happiness >= 80 && newStats.health >= 80) {
      setPetState('happy');
    } else {
      setPetState('idle');
    }
  }, []);

  const performAction = useCallback(async (action: ActionType) => {
    if (!alive || disabled) return;

    setDisabled(true);
    setCurrentAction(action); // Trigger animation
    
    try {
      const response = await fetch('/api/pet-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, currentStats: stats }),
      });

      const result = await response.json();
      
      if (result.status === 'success' && result.stats) {
        setStats(result.stats);
        updatePetState(result.stats);
        
        if (result.message) {
          showMessage(result.message);
        }

        const newActionCount = actionCount + 1;
        setActionCount(newActionCount);

        // Send Reddit update for every action in multiplayer mode
        const messages = {
          feed: `fed the community Snoo a delicious pixel-burger! 🍔`,
          play: `played with the community Snoo and had a great time! 🎮`,
          clean: `cleaned up the community Snoo's mess! 🧼`,
          sleep: `tucked the community Snoo into bed for a nap! 😴`,
          talk: `had a heart-to-heart conversation with the community Snoo! 💬`,
        };
        
        await sendRedditUpdate(action, messages[action]);
      }
    } catch (error) {
      console.error('Action failed:', error);
      showMessage('Action failed. Please try again.');
    } finally {
      // Reset action after animation completes
      setTimeout(() => {
        setCurrentAction('idle');
        setDisabled(false);
      }, action === 'sleep' ? 3000 : 2000);
    }
  }, [alive, disabled, stats, actionCount, updatePetState, showMessage, sendRedditUpdate]);

  const restartGame = useCallback(async () => {
    if (disabled) return;
    
    setDisabled(true);
    
    if (!alive) {
      const ageInMinutes = Math.round((Date.now() - birthTime) / 60000);
      await sendRedditUpdate('death', `Community Snoo lived ${ageInMinutes} minutes before going to r/snooheaven 💀`);
    }

    try {
      // Reset shared state on server
      await fetch('/api/pet-restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      setStats(INITIAL_STATS);
      setPetState('idle');
      setCurrentAction('idle');
      setAlive(true);
      setActionCount(0);
      setMessage('');
      showMessage('COMMUNITY SNOO REBORN!');
      
      await sendRedditUpdate('restart', 'restarted the community Snoo! A new life begins! 🔄');
    } catch (error) {
      console.error('Restart failed:', error);
      showMessage('Restart failed. Please try again.');
    }
    
    setTimeout(() => setDisabled(false), 300);
  }, [alive, disabled, birthTime, sendRedditUpdate, showMessage]);

  // Auto-decay loop - now synced across all users
  useEffect(() => {
    if (!alive) return;

    const interval = setInterval(() => {
      setStats(prevStats => {
        const newStats = {
          ...prevStats,
          hunger: Math.max(0, prevStats.hunger - DECAY_RATE.hunger),
          cleanliness: Math.max(0, prevStats.cleanliness - DECAY_RATE.cleanliness),
          energy: Math.max(0, prevStats.energy - DECAY_RATE.energy),
          happiness: Math.max(0, prevStats.happiness - DECAY_RATE.happiness),
          age: prevStats.age + 0.167, // 10 seconds = 0.167 minutes
        };

        // Health logic
        const lowStats = [newStats.hunger, newStats.cleanliness, newStats.energy].filter(stat => stat <= 0).length;
        if (lowStats > 0) {
          newStats.health = Math.max(0, newStats.health - (lowStats * 5));
        } else if (newStats.hunger > 70 && newStats.cleanliness > 70 && newStats.energy > 70) {
          newStats.health = Math.min(100, newStats.health + 1);
        }

        updatePetState(newStats);
        
        // Update shared state on server
        fetch('/api/pet-state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stats: newStats, alive: newStats.health > 0 }),
        }).catch(console.error);
        
        return newStats;
      });
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [alive, updatePetState]);

  // Death check - Any stat hitting 0 causes death
  useEffect(() => {
    if ((stats.health <= 0 || stats.hunger <= 0 || stats.cleanliness <= 0 || stats.energy <= 0) && alive) {
      setAlive(false);
      setPetState('dead');
      const ageInMinutes = Math.round(stats.age);
      showMessage(`COMMUNITY SNOO DIED AT ${ageInMinutes}M`, -1);
    }
  }, [stats.health, stats.hunger, stats.cleanliness, stats.energy, alive, stats.age, showMessage]);

  const getUrgencyMessage = () => {
    const criticalStats = [];
    if (stats.hunger <= 20) criticalStats.push('HUNGRY');
    if (stats.cleanliness <= 20) criticalStats.push('DIRTY');
    if (stats.energy <= 20) criticalStats.push('TIRED');
    if (stats.health <= 30) criticalStats.push('SICK');
    
    if (criticalStats.length > 0) {
      return `URGENT: Snoo is ${criticalStats.join(', ')}!`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4 relative">
      {showBanner && <Banner />}
      
      <div className="game-container">
        <div className="giga-pet-device">
          {/* Brand Label */}
          <div className="brand-label pixel-font">
            COMMUNITY GIGA SNOO
          </div>

          {/* LCD Screen */}
          <div className="lcd-screen">
            {/* Urgency Message */}
            {getUrgencyMessage() && (
              <div className="urgency-message lcd-text">
                {getUrgencyMessage()}
              </div>
            )}

            {/* Message Display */}
            {message && (
              <div className="lcd-message lcd-text">
                {message}
              </div>
            )}

            {/* Pet Display */}
            <SnooSprite state={petState} currentAction={currentAction} />

            {/* Stats Panel */}
            <StatsPanel stats={stats} />

            {/* Age Display */}
            <div className="age-display lcd-text">
              {Math.round(stats.age)}MIN
            </div>

            {/* Death Overlay */}
            {!alive && (
              <div className="death-overlay">
                <div className="lcd-text" style={{ fontSize: '16px', marginBottom: '8px' }}>
                  R.I.P.
                </div>
                <div className="lcd-text" style={{ fontSize: '12px' }}>
                  COMMUNITY SNOO DIED
                </div>
                <div className="lcd-text" style={{ fontSize: '10px', marginTop: '4px' }}>
                  PRESS RESTART
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <ActionButtons
            onAction={performAction}
            onRestart={restartGame}
            alive={alive}
            disabled={disabled}
          />
        </div>

        {/* Community Feed */}
        <CommunityFeed className="community-panel" />
      </div>

      <div className="text-center mt-4 text-xs text-gray-500 pixel-font">
        {alive ? 'KEEP THE COMMUNITY SNOO ALIVE!' : 'GAME OVER - RESTART TO CONTINUE'}
      </div>
      
      <div
        className="absolute top-2 right-2 z-50 cursor-pointer"
        onClick={() => navigateTo('https://bolt.new')}
      >
        <img
          src={boltBadge}
          alt="Built with Bolt.new badge"
          className="w-16 h-16 rounded-full shadow-lg"
        />
      </div>
    </div>
  );
};