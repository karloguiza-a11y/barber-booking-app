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

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     tags:
 *       - Reservations
 *     summary: Create new reservation
 *     description: Book a new appointment at the barbershop. An SMS confirmation will be automatically sent to the client if SMS is enabled.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - barberId
 *               - serviceId
 *               - date
 *               - startTime
 *             properties:
 *               barberId:
 *                 type: string
 *                 example: barber-123
 *               serviceId:
 *                 type: string
 *                 example: service-456
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               startTime:
 *                 type: string
 *                 format: time
 *                 example: 10:00
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservation created successfully. SMS confirmation sent (if enabled).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     smsNotification:
 *                       type: string
 *                       example: "SMS confirmation sent to client phone number"
 *       400:
 *         description: Invalid input or time slot unavailable
 */
router.post('/', createReservation);

/**
 * @swagger
 * /api/reservations/my-reservations:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Get user's reservations
 *     description: Retrieve all reservations for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Reservations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       date:
 *                         type: string
 *                       status:
 *                         type: string
 *                       barber:
 *                         type: object
 *                       service:
 *                         type: object
 */
router.get('/my-reservations', getMyReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Get reservation by ID
 *     description: Retrieve details of a specific reservation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation retrieved successfully
 *       404:
 *         description: Reservation not found
 */
router.get('/:id', getReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   patch:
 *     tags:
 *       - Reservations
 *     summary: Update reservation
 *     description: Modify an existing reservation (date, time, notes)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 format: time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       400:
 *         description: Time slot unavailable or invalid input
 *       404:
 *         description: Reservation not found
 */
router.patch('/:id', updateReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     tags:
 *       - Reservations
 *     summary: Cancel reservation
 *     description: Cancel an existing reservation. An SMS cancellation notice will be automatically sent to the client if SMS is enabled.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully. SMS cancellation notification sent (if enabled).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     smsNotification:
 *                       type: string
 *                       example: "SMS cancellation notice sent to client phone number"
 *       404:
 *         description: Reservation not found
 */
router.delete('/:id', cancelReservation);

export default router;
