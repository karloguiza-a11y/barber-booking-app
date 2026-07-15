import { Router } from 'express';
import {
  getBarbersWithServices,
  getBarber,
  createBarber,
  updateBarber,
  deleteBarber,
} from '../controllers/barber.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.get('/', getBarbersWithServices);
router.get('/:id', getBarber);

router.use(authMiddleware, requireRole([UserRole.ADMIN]));
router.post('/', createBarber);
router.patch('/:id', updateBarber);
router.delete('/:id', deleteBarber);

export default router;
