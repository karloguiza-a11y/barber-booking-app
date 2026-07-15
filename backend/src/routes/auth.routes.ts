import { Router } from 'express';
import { registerClient, login, me } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, registerClient);
router.post('/login', authLimiter, login);
router.get('/me', authMiddleware, me);

export default router;
