import { Router } from 'express';
import {
  getDashboardStats,
  getReservationsForCalendar,
  getClients,
  getClientDetails,
} from '../controllers/admin.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware, requireRole([UserRole.ADMIN]));

router.get('/stats', getDashboardStats);
router.get('/calendar', getReservationsForCalendar);
router.get('/clients', getClients);
router.get('/clients/:id', getClientDetails);

export default router;
