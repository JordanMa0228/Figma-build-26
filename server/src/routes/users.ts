import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

const usersLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

// GET /api/users/settings — return user's settings from DB (or default {})
router.get('/settings', usersLimiter, authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    let settings = {};
    try {
      settings = JSON.parse(user.settings || '{}');
    } catch {
      settings = {};
    }
    res.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/users/settings — save user's settings to DB
router.patch('/settings', usersLimiter, authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const settingsData = req.body;
    await prisma.user.update({
      where: { id: userId },
      data: { settings: JSON.stringify(settingsData) },
    });
    res.json({ settings: settingsData });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
