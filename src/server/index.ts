import express from 'express';
import { createServer, getContext, getServerPort } from '@devvit/server';
import { PetActionResponse, RedditUpdateResponse, ActionType, PetStats } from '../shared/types/pet';
import { getRedis } from '@devvit/redis';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

const router = express.Router();

// Shared pet state key
const PET_STATE_KEY = 'community_pet_state';
const COMMUNITY_ACTIONS_KEY = 'community_actions';

// Action descriptions for Reddit comments
const actionDescriptions = {
  feed: 'fed the community Snoo with pixel food',
  play: 'played games with the community Snoo',
  clean: 'cleaned the community Snoo with pixel bubbles',
  sleep: 'tucked the community Snoo into bed',
  talk: 'had a conversation with the community Snoo',
  restart: 'restarted the community Snoo for a new life',
  death: 'witnessed the community Snoo pass away'
};

// Helper function to get username safely
const getUsername = (userId: string): string => {
  try {
    // Extract a readable portion of the userId
    if (userId && userId.length > 8) {
      return userId.substring(0, 8) + '...';
    }
    return userId || 'Anonymous';
  } catch (error) {
    console.error('Error processing username:', error);
    return 'Anonymous';
  }
};

// Helper function to validate and parse JSON safely
const safeJsonParse = (jsonString: string): any => {
  try {
    // Check if the string is valid before parsing
    if (!jsonString || typeof jsonString !== 'string' || jsonString.trim() === '') {
      return null;
    }
    
    // Additional validation - check if it looks like JSON
    const trimmed = jsonString.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      console.warn('Invalid JSON format detected:', trimmed);
      return null;
    }
    
    return JSON.parse(trimmed);
  } catch (error) {
    console.error('JSON parsing error:', error, 'Input:', jsonString);
    return null;
  }
};

// Pet action endpoint
router.post<{}, PetActionResponse, { action: ActionType; currentStats: PetStats }>(
  '/api/pet-action',
  async (req, res): Promise<void> => {
    const { action, currentStats } = req.body;
    const { postId, userId } = getContext();

    if (!postId || !userId) {
      res.status(400).json({ status: 'error', message: 'Missing context' });
      return;
    }

    if (!action || !currentStats) {
      res.status(400).json({ status: 'error', message: 'Missing action or stats' });
      return;
    }

    try {
      const redis = getRedis();
      const newStats = { ...currentStats };
      let message = '';

      switch (action) {
        case 'feed':
          newStats.hunger = Math.min(100, newStats.hunger + 25);
          newStats.happiness = Math.min(100, newStats.happiness + 5);
          message = 'Snoo enjoyed the pixel meal!';
          break;

        case 'play':
          newStats.happiness = Math.min(100, newStats.happiness + 20);
          newStats.energy = Math.max(0, newStats.energy - 10);
          message = 'Snoo had fun playing games!';
          break;

        case 'clean':
          newStats.cleanliness = Math.min(100, newStats.cleanliness + 30);
          newStats.happiness = Math.min(100, newStats.happiness + 5);
          message = 'Snoo feels fresh and clean!';
          break;

        case 'sleep':
          newStats.energy = Math.min(100, newStats.energy + 35);
          newStats.health = Math.min(100, newStats.health + 5);
          message = 'Snoo had a refreshing nap!';
          break;

        case 'talk':
          newStats.happiness = Math.min(100, newStats.happiness + 15);
          message = 'Snoo loves chatting with you!';
          break;

        default:
          res.status(400).json({ status: 'error', message: 'Invalid action' });
          return;
      }

      // Get username for logging
      const username = getUsername(userId);

      // Update shared pet state
      const sharedState = {
        stats: newStats,
        alive: newStats.health > 0 && newStats.hunger > 0 && newStats.cleanliness > 0 && newStats.energy > 0,
        lastActionBy: username,
        lastActionTime: Date.now()
      };

      await redis.set(`${PET_STATE_KEY}:${postId}`, JSON.stringify(sharedState));

      // Log community action using hash instead of list
      const communityAction = {
        id: `${Date.now()}_${userId}`,
        username: username,
        action,
        message: actionDescriptions[action] || 'performed an action',
        timestamp: Date.now()
      };

      try {
        // Store action with timestamp as key in hash
        await redis.hset(
          `${COMMUNITY_ACTIONS_KEY}:${postId}`, 
          `action_${Date.now()}`, 
          JSON.stringify(communityAction)
        );

        // Increment total actions counter
        await redis.incr(`${COMMUNITY_ACTIONS_KEY}:${postId}:count`);
      } catch (redisError) {
        console.error('Redis action logging failed:', redisError);
        // Continue without failing the action
      }

      res.json({
        status: 'success',
        stats: newStats,
        message,
      });
    } catch (error) {
      console.error('Pet action error:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }
);

// Get shared pet state
router.get('/api/pet-state', async (req, res): Promise<void> => {
  const { postId } = getContext();

  if (!postId) {
    res.status(400).json({ status: 'error', message: 'Missing context' });
    return;
  }

  try {
    const redis = getRedis();
    const stateData = await redis.get(`${PET_STATE_KEY}:${postId}`);
    
    if (stateData) {
      const state = safeJsonParse(stateData);
      if (state) {
        res.json({ status: 'success', ...state });
      } else {
        res.json({ status: 'success', stats: null });
      }
    } else {
      res.json({ status: 'success', stats: null });
    }
  } catch (error) {
    console.error('Get pet state error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Update shared pet state
router.post('/api/pet-state', async (req, res): Promise<void> => {
  const { stats, alive } = req.body;
  const { postId, userId } = getContext();

  if (!postId || !userId) {
    res.status(400).json({ status: 'error', message: 'Missing context' });
    return;
  }

  try {
    const redis = getRedis();
    
    // Get username
    const username = getUsername(userId);

    const sharedState = {
      stats,
      alive,
      lastActionBy: username,
      lastActionTime: Date.now()
    };

    await redis.set(`${PET_STATE_KEY}:${postId}`, JSON.stringify(sharedState));
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Update pet state error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Restart shared pet
router.post('/api/pet-restart', async (req, res): Promise<void> => {
  const { postId, userId } = getContext();

  if (!postId || !userId) {
    res.status(400).json({ status: 'error', message: 'Missing context' });
    return;
  }

  try {
    const redis = getRedis();
    
    // Get username
    const username = getUsername(userId);
    
    // Reset shared state
    const initialStats = {
      health: 100,
      hunger: 100,
      cleanliness: 100,
      energy: 100,
      happiness: 100,
      age: 0,
    };

    const sharedState = {
      stats: initialStats,
      alive: true,
      lastActionBy: username,
      lastActionTime: Date.now()
    };

    await redis.set(`${PET_STATE_KEY}:${postId}`, JSON.stringify(sharedState));

    // Log restart action
    const communityAction = {
      id: `${Date.now()}_${userId}`,
      username: username,
      action: 'restart',
      message: 'restarted the community Snoo',
      timestamp: Date.now()
    };

    try {
      await redis.hset(
        `${COMMUNITY_ACTIONS_KEY}:${postId}`, 
        `action_${Date.now()}`, 
        JSON.stringify(communityAction)
      );
      await redis.incr(`${COMMUNITY_ACTIONS_KEY}:${postId}:count`);
    } catch (redisError) {
      console.error('Redis restart logging failed:', redisError);
    }

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Restart pet error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Get community actions
router.get('/api/community-actions', async (req, res): Promise<void> => {
  const { postId } = getContext();

  if (!postId) {
    res.status(400).json({ status: 'error', message: 'Missing context' });
    return;
  }

  try {
    const redis = getRedis();
    
    let actions = [];
    let totalActions = 0;

    try {
      // Get actions from hash using hscan
      const actionsData = await redis.hscan(`${COMMUNITY_ACTIONS_KEY}:${postId}`, 0);
      
      if (actionsData && actionsData.fieldValues) {
        actions = actionsData.fieldValues
          .map(fv => {
            // Safely parse each action
            const parsedAction = safeJsonParse(fv.value);
            if (parsedAction && parsedAction.username && parsedAction.message) {
              return parsedAction;
            }
            return null;
          })
          .filter(action => action !== null) // Remove invalid entries
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10); // Get last 10 actions
      }

      // Get total actions count
      const totalActionsStr = await redis.get(`${COMMUNITY_ACTIONS_KEY}:${postId}:count`);
      totalActions = totalActionsStr ? parseInt(totalActionsStr, 10) : 0;
    } catch (redisError) {
      console.error('Redis community actions fetch failed:', redisError);
      // Return empty data instead of failing
    }

    res.json({
      status: 'success',
      actions,
      totalActions
    });
  } catch (error) {
    console.error('Get community actions error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Reddit update endpoint - Posts comments to Reddit
router.post<{}, RedditUpdateResponse, { action: string; message: string }>(
  '/api/reddit-update',
  async (req, res): Promise<void> => {
    const { action, message } = req.body;
    const { postId, userId } = getContext();

    if (!postId || !userId) {
      res.status(400).json({ status: 'error', message: 'Missing context' });
      return;
    }

    try {
      // Get username
      const username = getUsername(userId);

      // Store the update in Redis for activity feed
      const redis = getRedis();
      const updateKey = `pet_update:${postId}:${userId}:${Date.now()}`;
      
      try {
        await redis.set(updateKey, JSON.stringify({ 
          action, 
          message, 
          username,
          timestamp: Date.now() 
        }));
      } catch (redisError) {
        console.error('Redis update storage failed:', redisError);
      }
      
      // Note: Actual Reddit comment posting would require Reddit API integration
      // For now, we'll just log the action and store it for the community feed
      console.log(`Reddit update for ${username}: ${message}`);

      res.json({ status: 'success' });
    } catch (error) {
      console.error('Reddit update error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to send update' });
    }
  }
);

app.use(router);

const port = getServerPort();
const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port, () => console.log(`http://localhost:${port}`));