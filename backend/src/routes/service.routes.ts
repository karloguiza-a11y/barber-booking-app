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

/**
 * @swagger
 * /api/services:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get all services
 *     description: Retrieve a list of all barbershop services available
 *     responses:
 *       200:
 *         description: Services retrieved successfully
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
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       duration:
 *                         type: number
 */
router.get('/', getServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get service by ID
 *     description: Retrieve details of a specific service
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *       404:
 *         description: Service not found
 */
router.get('/:id', getService);

/**
 * @swagger
 * /api/services:
 *   post:
 *     tags:
 *       - Services
 *     summary: Create new service (Admin only)
 *     description: Create a new barbershop service
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
 *               - description
 *               - price
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *                 example: Corte Clásico
 *               description:
 *                 type: string
 *                 example: Corte profesional clásico
 *               price:
 *                 type: number
 *                 example: 50
 *               duration:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Service created successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', authMiddleware, requireRole([UserRole.ADMIN]), createService);

/**
 * @swagger
 * /api/services/{id}:
 *   patch:
 *     tags:
 *       - Services
 *     summary: Update service (Admin only)
 *     description: Update an existing service details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       404:
 *         description: Service not found
 */
router.patch('/:id', authMiddleware, requireRole([UserRole.ADMIN]), updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     tags:
 *       - Services
 *     summary: Delete service (Admin only)
 *     description: Delete a barbershop service
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 */
router.delete('/:id', authMiddleware, requireRole([UserRole.ADMIN]), deleteService);

export default router;
