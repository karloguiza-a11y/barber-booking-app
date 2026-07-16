import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import PaymentService from '../services/payment.service';
import { paymentConfig } from '../config/payment';

const prisma = new PrismaClient();

/**
 * Create Stripe Payment Intent
 * POST /api/payments/stripe/create-intent
 * Body: { reservationId: string, amount: number, currency: string }
 */
export const createStripeIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reservationId, amount, currency } = req.body;

    // Validate input
    if (!reservationId || !amount || !currency) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Verify reservation exists
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { client: true, barber: true, service: true },
    });

    if (!reservation) {
      res.status(404).json({ error: 'Reservation not found' });
      return;
    }

    // Create Stripe payment intent
    const paymentIntent = await PaymentService.createStripePaymentIntent(amount, currency, {
      reservationId,
      clientId: reservation.clientId,
      barberId: reservation.barberId,
      serviceId: reservation.serviceId,
      appointmentDate: reservation.appointmentDate.toISOString(),
      clientEmail: reservation.client.email,
    });

    // Create payment record in database
    const payment = await PaymentService.createPaymentRecord(
      reservationId,
      amount,
      currency,
      'stripe',
      paymentIntent.id,
      undefined,
      paymentIntent.client_secret || undefined
    );

    res.json({
      paymentId: payment.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * Create PayPal Order
 * POST /api/payments/paypal/create-order
 * Body: { reservationId: string, amount: number, currency: string }
 */
export const createPayPalOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reservationId, amount, currency } = req.body;

    if (!reservationId || !amount || !currency) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { client: true, barber: true, service: true },
    });

    if (!reservation) {
      res.status(404).json({ error: 'Reservation not found' });
      return;
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const returnUrl = `${frontendUrl}/payments/success`;
    const cancelUrl = `${frontendUrl}/payments/cancel`;

    const paypalOrder = await PaymentService.createPayPalOrder(
      amount,
      currency,
      {
        reservationId,
        clientId: reservation.clientId,
        barberId: reservation.barberId,
        serviceId: reservation.serviceId,
        appointmentDate: reservation.appointmentDate.toISOString(),
        clientEmail: reservation.client.email,
      },
      returnUrl,
      cancelUrl
    );

    const payment = await PaymentService.createPaymentRecord(
      reservationId,
      amount,
      currency,
      'paypal',
      undefined,
      (paypalOrder as any).id
    );

    res.json({
      paymentId: payment.id,
      orderId: (paypalOrder as any).id,
      links: (paypalOrder as any).links,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * Confirm Payment
 * POST /api/payments/confirm
 * Body: { paymentId: string, provider: 'stripe' | 'paypal' }
 */
export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId, provider } = req.body;

    if (!paymentId || !provider) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const payment = await PaymentService.getPaymentStatus(paymentId);

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    let status = 'COMPLETED';

    if (provider === 'stripe' && payment.stripePaymentIntentId) {
      const stripePayment = await PaymentService.confirmStripePayment(
        payment.stripePaymentIntentId
      );

      if (stripePayment.status !== 'succeeded') {
        status = 'FAILED';
      }
    } else if (provider === 'paypal' && payment.paypalOrderId) {
      const paypalPayment = await PaymentService.capturePayPalPayment(payment.paypalOrderId);

      if (((paypalPayment as any).status as string) !== 'COMPLETED') {
        status = 'FAILED';
      }
    }

    const updatedPayment = await PaymentService.updatePaymentStatus(
      paymentId,
      status as any
    );

    // If payment is completed, update reservation status to CONFIRMED
    if (status === 'COMPLETED') {
      await prisma.reservation.update({
        where: { id: payment.reservationId },
        data: { status: 'CONFIRMED' },
      });
    }

    res.json({ payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * Refund Payment
 * POST /api/payments/:id/refund
 * Body: { reason?: string }
 */
export const refundPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const refundedPayment = await PaymentService.refundPayment(id, reason);

    res.json({ payment: refundedPayment });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * Get Payment Status
 * GET /api/payments/:id/status
 */
export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const payment = await PaymentService.getPaymentStatus(id);

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    res.json({ payment });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export default {
  createStripeIntent,
  createPayPalOrder,
  confirmPayment,
  refundPayment,
  getPaymentStatus,
};
