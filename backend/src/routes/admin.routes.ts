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

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get dashboard statistics
 *     description: Retrieve dashboard statistics (total reservations, revenue, etc.)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
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
 *                     totalReservations:
 *                       type: integer
 *                     totalClients:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     completedReservations:
 *                       type: integer
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.get('/stats', getDashboardStats);

/**
 * @swagger
 * /api/admin/calendar:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get reservations for calendar
 *     description: Retrieve all reservations for calendar view
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date
 *     responses:
 *       200:
 *         description: Calendar reservations retrieved successfully
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
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.get('/calendar', getReservationsForCalendar);

/**
 * @swagger
 * /api/admin/clients:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all clients
 *     description: Retrieve list of all clients with their reservation counts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Clients list retrieved successfully
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
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       reservationCount:
 *                         type: integer
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.get('/clients', getClients);

/**
 * @swagger
 * /api/admin/clients/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get client details
 *     description: Retrieve detailed information about a specific client
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client details retrieved successfully
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
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     reservations:
 *                       type: array
 *       404:
 *         description: Client not found
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.get('/clients/:id', getClientDetails);

export default router;
