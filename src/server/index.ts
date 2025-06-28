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
          message = '🍔 Snoo enjoyed the meal!';
          break;

        case 'play':
          newStats.happiness = Math.min(100, newStats.happiness + 20);
          newStats.energy = Math.max(0, newStats.energy - 10);
          message = '🎮 Snoo had fun playing!';
          break;

        case 'clean':
          newStats.cleanliness = Math.min(100, newStats.cleanliness + 30);
          newStats.happiness = Math.min(100, newStats.happiness + 5);
          message = '🧼 Snoo feels fresh and clean!';
          break;

        case 'sleep':
          newStats.energy = Math.min(100, newStats.energy + 35);
          newStats.health = Math.min(100, newStats.health + 5);
          message = '😴 Snoo had a refreshing nap!';
          break;

        case 'talk':
          newStats.happiness = Math.min(100, newStats.happiness + 15);
          message = '💬 Snoo loves chatting with you!';
          break;

        default:
          res.status(400).json({ status: 'error', message: 'Invalid action' });
          return;
      }

      // Update shared pet state
      const sharedState = {
        stats: newStats,
        alive: newStats.health > 0 && newStats.hunger > 0 && newStats.cleanliness > 0 && newStats.energy > 0,
        lastActionBy: userId,
        lastActionTime: Date.now()
      };

      await redis.set(`${PET_STATE_KEY}:${postId}`, JSON.stringify(sharedState));

      // Log community action
      const communityAction = {
        id: `${Date.now()}_${userId}`,
        username: userId.substring(0, 8) + '...',
        action,
        message: `performed ${action} action`,
        timestamp: Date.now()
      };

      await redis.lpush(`${COMMUNITY_ACTIONS_KEY}:${postId}`, JSON.stringify(communityAction));
      await redis.ltrim(`${COMMUNITY_ACTIONS_KEY}:${postId}`, 0, 49); // Keep last 50 actions

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
      const state = JSON.parse(stateData);
      res.json({ status: 'success', ...state });
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
    const sharedState = {
      stats,
      alive,
      lastActionBy: userId,
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
      lastActionBy: userId,
      lastActionTime: Date.now()
    };

    await redis.set(`${PET_STATE_KEY}:${postId}`, JSON.stringify(sharedState));

    // Log restart action
    const communityAction = {
      id: `${Date.now()}_${userId}`,
      username: userId.substring(0, 8) + '...',
      action: 'restart',
      message: 'restarted the community Snoo',
      timestamp: Date.now()
    };

    await redis.lpush(`${COMMUNITY_ACTIONS_KEY}:${postId}`, JSON.stringify(communityAction));

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
    const actionsData = await redis.lrange(`${COMMUNITY_ACTIONS_KEY}:${postId}`, 0, 9); // Get last 10 actions
    
    const actions = actionsData.map(data => JSON.parse(data));
    const totalActions = await redis.llen(`${COMMUNITY_ACTIONS_KEY}:${postId}`);

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

// Reddit update endpoint
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
      // Store the update in Redis for potential future use
      const redis = getRedis();
      const updateKey = `pet_update:${postId}:${userId}:${Date.now()}`;
      await redis.set(updateKey, JSON.stringify({ action, message, timestamp: Date.now() }));
      
      // In a real implementation, you would use the Reddit API here
      // For now, we'll just acknowledge the update
      console.log(`Reddit update for ${userId}: ${message}`);

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