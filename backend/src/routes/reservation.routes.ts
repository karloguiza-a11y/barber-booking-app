import { Router } from 'express';
import {
  createReservation,
  getReservation,
  updateReservation,
  cancelReservation,
  getMyReservations,
} from '../controllers/reservation.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createReservation);
router.get('/my-reservations', getMyReservations);
router.get('/:id', getReservation);
router.patch('/:id', updateReservation);
router.delete('/:id', cancelReservation);

export default router;
