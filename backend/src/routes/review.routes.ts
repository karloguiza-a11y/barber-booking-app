import { Router } from 'express';
import {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByBarber,
  getMyReviews,
  getReview,
  markReviewHelpful,
  markReviewUnhelpful,
  reportReview,
  getReportedReviews,
  deleteReportedReview,
  getBarberRating,
  getServiceRating,
  getReviewForReservation,
} from '../controllers/review.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// === RUTAS ESPECÍFICAS PRIMERO (evitar conflicto con :{id}) ===

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create a new review
 *     description: Create a review for a completed reservation. Can only be created after the appointment date.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationId
 *               - rating
 *             properties:
 *               reservationId:
 *                 type: string
 *                 example: reservation-123
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: Great haircut!
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *                 example: The barber did an excellent job. Very professional.
 *               images:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                   format: url
 *                 example:
 *                   - https://example.com/image1.jpg
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid input or reservation already has a review
 *       404:
 *         description: Reservation not found
 */
router.post('/', createReview);

/**
 * @swagger
 * /api/reviews/my-reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get my reviews
 *     description: Retrieve all reviews created by the authenticated user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: User reviews retrieved successfully
 */
router.get('/my-reviews', getMyReviews);

/**
 * @swagger
 * /api/reviews/reported:
 *   get:
 *     tags:
 *       - Reviews
 *       - Admin
 *     summary: Get reported reviews
 *     description: Admin only - Get all reported reviews for moderation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Reported reviews retrieved
 *       403:
 *         description: Admin access required
 */
router.get('/reported', requireRole('ADMIN'), getReportedReviews);

/**
 * @swagger
 * /api/reviews/barber/{barberId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews for a barber
 *     description: Retrieve paginated reviews for a specific barber
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: barberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Barber ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [recent, helpful, rating]
 *           default: recent
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('/barber/:barberId', getReviewsByBarber);

/**
 * @swagger
 * /api/reviews/reservation/{reservationId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get review for reservation
 *     description: Get the review (if exists) for a specific reservation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Review retrieved (or null if not exists)
 */
router.get('/reservation/:reservationId', getReviewForReservation);

// === RUTAS CON :{id} ===

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get a review by ID
 *     description: Retrieve details of a specific review
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       404:
 *         description: Review not found
 */
router.get('/:id', getReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   patch:
 *     tags:
 *       - Reviews
 *     summary: Update a review
 *     description: Update an existing review. Only the review creator can update.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *               images:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       403:
 *         description: You can only update your own reviews
 *       404:
 *         description: Review not found
 */
router.patch('/:id', updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review
 *     description: Delete (soft delete) a review. Only the review creator can delete.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: You can only delete your own reviews
 *       404:
 *         description: Review not found
 */
router.delete('/:id', deleteReview);

/**
 * @swagger
 * /api/reviews/{id}/helpful:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Mark review as helpful
 *     description: Increment helpful count for a review
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review marked as helpful
 *       404:
 *         description: Review not found
 */
router.post('/:id/helpful', markReviewHelpful);

/**
 * @swagger
 * /api/reviews/{id}/unhelpful:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Mark review as unhelpful
 *     description: Increment unhelpful count for a review
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review marked as unhelpful
 *       404:
 *         description: Review not found
 */
router.post('/:id/unhelpful', markReviewUnhelpful);

/**
 * @swagger
 * /api/reviews/{id}/report:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Report a review
 *     description: Report a review as inappropriate
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Review reported successfully
 *       400:
 *         description: Invalid report reason
 *       404:
 *         description: Review not found
 */
router.post('/:id/report', reportReview);

/**
 * @swagger
 * /api/reviews/{id}/reported:
 *   delete:
 *     tags:
 *       - Reviews
 *       - Admin
 *     summary: Delete a reported review
 *     description: Admin only - Delete a review that has been reported as inappropriate
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Review not found
 */
router.delete('/:id/reported', requireRole('ADMIN'), deleteReportedReview);

// === RUTAS DE RATINGS (fuera del router de reviews pero similar estructura) ===
// Nota: Estas rutas están en /api/barber y /api/service, no en /api/reviews

export default router;
