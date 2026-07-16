import { Request, Response } from 'express';
import { stripe, stripeConfig } from '../config/payment';
import PaymentService from './payment.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Handle Stripe Webhook Events
 * POST /api/webhooks/stripe
 */
export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, stripeConfig.webhookSecret);
  } catch (error) {
    res.status(400).send(`Webhook Error: ${(error as Error).message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        const payment = await PaymentService.getPaymentByStripeIntentId(paymentIntent.id);

        if (payment) {
          await PaymentService.updatePaymentStatus(payment.id, 'COMPLETED', {
            stripeEventId: event.id,
            succeededAt: new Date().toISOString(),
          });

          // Update reservation status
          await prisma.reservation.update({
            where: { id: payment.reservationId },
            data: { status: 'CONFIRMED' },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        const payment = await PaymentService.getPaymentByStripeIntentId(paymentIntent.id);

        if (payment) {
          await PaymentService.updatePaymentStatus(payment.id, 'FAILED', {
            stripeEventId: event.id,
            failedAt: new Date().toISOString(),
            failureReason: paymentIntent.last_payment_error?.message,
          });
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as any;
        // Find payment by transaction ID
        const payment = await prisma.payment.findFirst({
          where: { transactionId: charge.id },
        });

        if (payment) {
          await PaymentService.updatePaymentStatus(payment.id, 'REFUNDED', {
            stripeEventId: event.id,
            refundedAt: new Date().toISOString(),
            refundAmount: charge.refunded,
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  handleStripeWebhook,
};
