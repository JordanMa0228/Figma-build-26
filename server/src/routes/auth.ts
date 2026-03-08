import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, register } from '../controllers/authController';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

// POST /api/auth/login
router.post('/login', authLimiter, login);

// POST /api/auth/register
router.post('/register', authLimiter, register);

export default router;
