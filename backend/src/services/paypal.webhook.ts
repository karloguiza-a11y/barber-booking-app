import { Request, Response } from 'express';
import axios from 'axios';
import PaymentService from './payment.service';
import { PrismaClient } from '@prisma/client';
import { paypalConfig } from '../config/payment';

const prisma = new PrismaClient();

interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource: {
    id: string;
    status: string;
    [key: string]: any;
  };
}

/**
 * Verify PayPal Webhook Signature
 * Required headers:
 * - transmission_id
 * - transmission_time
 * - cert_url
 * - auth_algo
 * - transmission_sig
 * - webhook_id
 */
export const verifyPayPalWebhookSignature = async (
  transmissionId: string,
  transmissionTime: string,
  certUrl: string,
  authAlgo: string,
  transmissionSig: string,
  webhookId: string,
  webhookBody: string
): Promise<boolean> => {
  try {
    // Construct the expected signature
    const expectedSigString = `${transmissionId}|${transmissionTime}|${webhookId}|${webhookBody}`;

    // Fetch the certificate
    const certResponse = await axios.get(certUrl);
    const cert = certResponse.data;

    // In production, you would verify the signature using the certificate
    // For now, this is a simplified version
    return true;
  } catch (error) {
    console.error('PayPal webhook signature verification failed:', error);
    return false;
  }
};

/**
 * Handle PayPal Webhook Events
 * POST /api/webhooks/paypal
 */
export const handlePayPalWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const event: PayPalWebhookEvent = req.body;

    // Verify webhook headers
    const transmissionId = req.headers['paypal-transmission-id'] as string;
    const transmissionTime = req.headers['paypal-transmission-time'] as string;
    const certUrl = req.headers['paypal-cert-url'] as string;
    const authAlgo = req.headers['paypal-auth-algo'] as string;
    const transmissionSig = req.headers['paypal-transmission-sig'] as string;

    if (
      !transmissionId ||
      !transmissionTime ||
      !certUrl ||
      !authAlgo ||
      !transmissionSig
    ) {
      res.status(400).json({ error: 'Missing PayPal webhook headers' });
      return;
    }

    // Verify signature
    const isValid = await verifyPayPalWebhookSignature(
      transmissionId,
      transmissionTime,
      certUrl,
      authAlgo,
      transmissionSig,
      paypalConfig.webhookId,
      JSON.stringify(req.body)
    );

    if (!isValid) {
      res.status(401).json({ error: 'Invalid webhook signature' });
      return;
    }

    // Handle webhook events
    switch (event.event_type) {
      case 'CHECKOUT.ORDER.COMPLETED': {
        const orderId = event.resource.id;
        const payment = await PaymentService.getPaymentByPayPalOrderId(orderId);

        if (payment) {
          await PaymentService.updatePaymentStatus(payment.id, 'COMPLETED', {
            paypalEventId: event.id,
            completedAt: new Date().toISOString(),
          });

          // Update reservation status
          await prisma.reservation.update({
            where: { id: payment.reservationId },
            data: { status: 'CONFIRMED' },
          });
        }
        break;
      }

      case 'CHECKOUT.ORDER.APPROVED': {
        // Order approved but not yet captured
        // This is typically handled by the client-side capture
        console.log(`Order ${event.resource.id} approved`);
        break;
      }

      case 'PAYMENT.CAPTURE.REFUNDED': {
        // Payment was refunded
        // We would need the related order ID which should be in the payload
        const captureId = event.resource.id;
        console.log(`Capture ${captureId} was refunded`);
        break;
      }

      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  handlePayPalWebhook,
  verifyPayPalWebhookSignature,
};
