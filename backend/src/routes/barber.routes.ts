import { Router } from 'express';
import {
  getBarbersWithServices,
  getBarber,
  createBarber,
  updateBarber,
  deleteBarber,
} from '../controllers/barber.controller.js';
import { getBarberRating, getServiceRating } from '../controllers/review.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * /api/barbers:
 *   get:
 *     tags:
 *       - Barbers
 *     summary: Get all barbers with services
 *     description: Retrieve list of all barbers and their available services
 *     responses:
 *       200:
 *         description: Barbers retrieved successfully
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
 *                       phone:
 *                         type: string
 *                       services:
 *                         type: array
 *                         items:
 *                           type: object
 */
router.get('/', getBarbersWithServices);

/**
 * @swagger
 * /api/barbers/{id}:
 *   get:
 *     tags:
 *       - Barbers
 *     summary: Get barber by ID
 *     description: Retrieve details of a specific barber
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Barber ID
 *     responses:
 *       200:
 *         description: Barber retrieved successfully
 *       404:
 *         description: Barber not found
 */
router.get('/:id', getBarber);

/**
 * @swagger
 * /api/barbers:
 *   post:
 *     tags:
 *       - Barbers
 *     summary: Create new barber (Admin only)
 *     description: Add a new barber to the system
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: Carlos Martínez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: carlos@barbershop.com
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Barber created successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', authMiddleware, requireRole([UserRole.ADMIN]), createBarber);

/**
 * @swagger
 * /api/barbers/{id}:
 *   patch:
 *     tags:
 *       - Barbers
 *     summary: Update barber (Admin only)
 *     description: Update barber information and services
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Barber ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Barber updated successfully
 *       404:
 *         description: Barber not found
 */
router.patch('/:id', authMiddleware, requireRole([UserRole.ADMIN]), updateBarber);

/**
 * @swagger
 * /api/barbers/{id}:
 *   delete:
 *     tags:
 *       - Barbers
 *     summary: Delete barber (Admin only)
 *     description: Remove a barber from the system
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Barber ID
 *     responses:
 *       200:
 *         description: Barber deleted successfully
 *       404:
 *         description: Barber not found
 */
router.delete('/:id', authMiddleware, requireRole([UserRole.ADMIN]), deleteBarber);

/**
 * @swagger
 * /api/barbers/{barberId}/rating:
 *   get:
 *     tags:
 *       - Ratings
 *     summary: Get barber rating
 *     description: Get average rating and distribution for a barber
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: barberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Barber ID
 *     responses:
 *       200:
 *         description: Rating retrieved successfully
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
 *                     barberId:
 *                       type: string
 *                     average:
 *                       type: number
 *                     total:
 *                       type: integer
 *                     distribution:
 *                       type: object
 */
router.get('/:barberId/rating', authMiddleware, getBarberRating);

export default router;
