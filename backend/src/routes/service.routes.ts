import { Router } from 'express';
import {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
} from '../controllers/service.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.get('/', getServices);
router.get('/:id', getService);

router.use(authMiddleware, requireRole([UserRole.ADMIN]));
router.post('/', createService);
router.patch('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
