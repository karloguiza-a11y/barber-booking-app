import { Router, Request, Response } from 'express';
import {
  createStripeIntent,
  createPayPalOrder,
  confirmPayment,
  refundPayment,
  getPaymentStatus,
} from '../controllers/payment.controller';
import { handleStripeWebhook } from '../services/stripe.webhook';
import { handlePayPalWebhook } from '../services/paypal.webhook';

const router = Router();

/**
 * @swagger
 * /api/payments/stripe/create-intent:
 *   post:
 *     summary: Create a Stripe Payment Intent
 *     description: Creates a new Stripe payment intent for a reservation
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationId
 *               - amount
 *               - currency
 *             properties:
 *               reservationId:
 *                 type: string
 *                 description: ID of the reservation
 *               amount:
 *                 type: number
 *                 description: Amount in cents (100 = $1.00)
 *               currency:
 *                 type: string
 *                 description: ISO 4217 currency code (e.g., USD, EUR)
 *             example:
 *               reservationId: "cuid123"
 *               amount: 5000
 *               currency: "USD"
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentId:
 *                   type: string
 *                 clientSecret:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 currency:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Server error
 */
router.post('/stripe/create-intent', createStripeIntent);

/**
 * @swagger
 * /api/payments/paypal/create-order:
 *   post:
 *     summary: Create a PayPal Order
 *     description: Creates a new PayPal order for a reservation
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationId
 *               - amount
 *               - currency
 *             properties:
 *               reservationId:
 *                 type: string
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *             example:
 *               reservationId: "cuid123"
 *               amount: 5000
 *               currency: "USD"
 *     responses:
 *       200:
 *         description: PayPal order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentId:
 *                   type: string
 *                 orderId:
 *                   type: string
 *                 links:
 *                   type: array
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Server error
 */
router.post('/paypal/create-order', createPayPalOrder);

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm a Payment
 *     description: Confirms a payment and updates reservation status
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *               - provider
 *             properties:
 *               paymentId:
 *                 type: string
 *               provider:
 *                 type: string
 *                 enum: [stripe, paypal]
 *             example:
 *               paymentId: "cuid123"
 *               provider: "stripe"
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.post('/confirm', confirmPayment);

/**
 * @swagger
 * /api/payments/{id}/refund:
 *   post:
 *     summary: Refund a Payment
 *     description: Refunds a completed payment
 *     tags:
 *       - Payments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for refund
 *     responses:
 *       200:
 *         description: Payment refunded successfully
 *       400:
 *         description: Cannot refund this payment
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.post('/:id/refund', refundPayment);

/**
 * @swagger
 * /api/payments/{id}/status:
 *   get:
 *     summary: Get Payment Status
 *     description: Retrieves the current status of a payment
 *     tags:
 *       - Payments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment:
 *                   type: object
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get('/:id/status', getPaymentStatus);

/**
 * @swagger
 * /api/webhooks/stripe:
 *   post:
 *     summary: Stripe Webhook
 *     description: Handles incoming Stripe webhook events
 *     tags:
 *       - Webhooks
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook
 *       500:
 *         description: Server error
 */
router.post('/webhooks/stripe', (req: Request, res: Response) => {
  // Stripe webhook requires raw body, handle specially
  handleStripeWebhook(req, res);
});

/**
 * @swagger
 * /api/webhooks/paypal:
 *   post:
 *     summary: PayPal Webhook
 *     description: Handles incoming PayPal webhook events
 *     tags:
 *       - Webhooks
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook
 *       500:
 *         description: Server error
 */
router.post('/webhooks/paypal', (req: Request, res: Response) => {
  handlePayPalWebhook(req, res);
});

export default router;
