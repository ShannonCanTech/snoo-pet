import express from 'express';
import { createServer, getContext, getServerPort } from '@devvit/server';
import { PetActionResponse, RedditUpdateResponse, ActionType, PetStats } from '../shared/types/pet';
import { getRedis } from '@devvit/redis';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

const router = express.Router();

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