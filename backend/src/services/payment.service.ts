import { PrismaClient, PaymentStatus, Payment } from '@prisma/client';
import Stripe from 'stripe';
import paypal from 'paypal-checkout-server-sdk';
import {
  stripe,
  paypalClient,
  paymentConfig,
  PAYMENT_VALIDATION,
  PaymentProvider,
  PaymentMetadata,
} from '../config/payment';

const prisma = new PrismaClient();

export class PaymentService {
  /**
   * Validate payment amount
   * @param amount Amount in cents (100 = $1.00)
   * @throws Error if amount is invalid
   */
  static validateAmount(amount: number): boolean {
    if (!Number.isInteger(amount)) {
      throw new Error('Amount must be an integer (in cents)');
    }
    if (amount < PAYMENT_VALIDATION.MIN_AMOUNT) {
      throw new Error(`Minimum amount is ${PAYMENT_VALIDATION.MIN_AMOUNT} cents`);
    }
    if (amount > PAYMENT_VALIDATION.MAX_AMOUNT) {
      throw new Error(`Maximum amount is ${PAYMENT_VALIDATION.MAX_AMOUNT} cents`);
    }
    return true;
  }

  /**
   * Validate currency
   * @param currency ISO 4217 currency code
   * @throws Error if currency is not supported
   */
  static validateCurrency(currency: string): boolean {
    const normalized = currency.toUpperCase();
    if (!paymentConfig.supportedCurrencies.includes(normalized)) {
      throw new Error(
        `Currency ${currency} is not supported. Supported: ${paymentConfig.supportedCurrencies.join(', ')}`
      );
    }
    return true;
  }

  /**
   * Create a Stripe Payment Intent
   * @param amount Amount in cents
   * @param currency ISO 4217 currency code
   * @param metadata Payment metadata
   * @returns Payment Intent data
   */
  static async createStripePaymentIntent(
    amount: number,
    currency: string,
    metadata: PaymentMetadata
  ): Promise<Stripe.PaymentIntent> {
    this.validateAmount(amount);
    this.validateCurrency(currency);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: currency.toLowerCase(),
        metadata: metadata as Record<string, string>,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      throw new Error(`Failed to create Stripe payment intent: ${(error as Error).message}`);
    }
  }

  /**
   * Create a PayPal Order
   * @param amount Amount in cents
   * @param currency ISO 4217 currency code
   * @param metadata Payment metadata
   * @param returnUrl Return URL after payment
   * @param cancelUrl Cancel URL if payment fails
   * @returns PayPal Order data
   */
  static async createPayPalOrder(
    amount: number,
    currency: string,
    metadata: PaymentMetadata,
    returnUrl: string,
    cancelUrl: string
  ): Promise<paypal.orders.Order> {
    this.validateAmount(amount);
    this.validateCurrency(currency);

    try {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.body = {
        intent: 'CAPTURE',
        payer: {
          email_address: metadata.clientEmail as string,
        },
        purchase_units: [
          {
            reference_id: metadata.reservationId as string,
            amount: {
              currency_code: currency.toUpperCase(),
              value: (amount / 100).toFixed(2),
            },
            description: `Barbershop Service - Reservation ${metadata.reservationId}`,
            custom_id: metadata.reservationId as string,
          },
        ],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          brand_name: 'Barber Booking',
          locale: 'en-US',
          user_action: 'PAY_NOW',
        },
      };

      const response = await paypalClient.execute(request);
      return (response.result as unknown) as paypal.orders.Order;
    } catch (error) {
      throw new Error(`Failed to create PayPal order: ${(error as Error).message}`);
    }
  }

  /**
   * Confirm a Stripe payment
   * @param paymentIntentId Stripe Payment Intent ID
   * @returns Payment Intent data
   */
  static async confirmStripePayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new Error(`Failed to confirm Stripe payment: ${(error as Error).message}`);
    }
  }

  /**
   * Capture a PayPal payment
   * @param orderId PayPal Order ID
   * @returns PayPal Order data
   */
  static async capturePayPalPayment(orderId: string): Promise<paypal.orders.Order> {
    try {
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const response = await paypalClient.execute(request);
      return (response.result as unknown) as paypal.orders.Order;
    } catch (error) {
      throw new Error(`Failed to capture PayPal payment: ${(error as Error).message}`);
    }
  }

  /**
   * Refund a payment
   * @param paymentId Payment ID from database
   * @param reason Refund reason
   * @returns Updated Payment record
   */
  static async refundPayment(paymentId: string, reason?: string): Promise<Payment> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status === 'REFUNDED') {
        throw new Error('Payment already refunded');
      }

      if (payment.status !== 'COMPLETED') {
        throw new Error('Only completed payments can be refunded');
      }

      if (payment.provider === 'stripe' && payment.stripePaymentIntentId) {
        try {
          await stripe.refunds.create({
            payment_intent: payment.stripePaymentIntentId,
            reason: reason || 'requested_by_customer',
            metadata: { originalPaymentId: paymentId },
          });
        } catch (error) {
          throw new Error(`Stripe refund failed: ${(error as Error).message}`);
        }
      } else if (payment.provider === 'paypal' && payment.paypalOrderId) {
        // PayPal refunds require the capture ID, which we don't have stored
        // This would need to be updated in production to store capture ID
        throw new Error('PayPal refunds require additional implementation');
      }

      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REFUNDED',
          metadata: {
            ...(typeof payment.metadata === 'object' ? payment.metadata : {}),
            refundedAt: new Date().toISOString(),
            refundReason: reason,
          },
        },
      });

      return updatedPayment;
    } catch (error) {
      throw new Error(`Refund failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get payment status
   * @param paymentId Payment ID from database
   * @returns Payment record
   */
  static async getPaymentStatus(paymentId: string): Promise<Payment | null> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });
      return payment;
    } catch (error) {
      throw new Error(`Failed to retrieve payment status: ${(error as Error).message}`);
    }
  }

  /**
   * Create payment record in database
   * @param reservationId Reservation ID
   * @param amount Amount in cents
   * @param currency Currency code
   * @param provider Payment provider
   * @param stripePaymentIntentId Optional Stripe Payment Intent ID
   * @param paypalOrderId Optional PayPal Order ID
   * @returns Payment record
   */
  static async createPaymentRecord(
    reservationId: string,
    amount: number,
    currency: string,
    provider: PaymentProvider,
    stripePaymentIntentId?: string,
    paypalOrderId?: string,
    stripeClientSecret?: string
  ): Promise<Payment> {
    try {
      const payment = await prisma.payment.create({
        data: {
          reservationId,
          amount,
          currency,
          provider,
          status: 'PENDING',
          stripePaymentIntentId,
          paypalOrderId,
          stripeClientSecret,
        },
      });

      return payment;
    } catch (error) {
      throw new Error(`Failed to create payment record: ${(error as Error).message}`);
    }
  }

  /**
   * Update payment status
   * @param paymentId Payment ID
   * @param status New status
   * @param metadata Additional metadata
   * @returns Updated Payment record
   */
  static async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    metadata?: Record<string, unknown>
  ): Promise<Payment> {
    try {
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status,
          metadata: metadata ? { ...metadata } : undefined,
          updatedAt: new Date(),
        },
      });

      return payment;
    } catch (error) {
      throw new Error(`Failed to update payment status: ${(error as Error).message}`);
    }
  }

  /**
   * Get payment by Stripe Payment Intent ID
   * @param paymentIntentId Stripe Payment Intent ID
   * @returns Payment record or null
   */
  static async getPaymentByStripeIntentId(paymentIntentId: string): Promise<Payment | null> {
    try {
      return await prisma.payment.findUnique({
        where: { stripePaymentIntentId: paymentIntentId },
      });
    } catch (error) {
      throw new Error(`Failed to retrieve payment: ${(error as Error).message}`);
    }
  }

  /**
   * Get payment by PayPal Order ID
   * @param orderId PayPal Order ID
   * @returns Payment record or null
   */
  static async getPaymentByPayPalOrderId(orderId: string): Promise<Payment | null> {
    try {
      return await prisma.payment.findUnique({
        where: { paypalOrderId: orderId },
      });
    } catch (error) {
      throw new Error(`Failed to retrieve payment: ${(error as Error).message}`);
    }
  }

  /**
   * Convert dollars to cents
   * @param dollars Amount in dollars
   * @returns Amount in cents
   */
  static dollarsToCents(dollars: number): number {
    return Math.round(dollars * 100);
  }

  /**
   * Convert cents to dollars
   * @param cents Amount in cents
   * @returns Amount in dollars
   */
  static centsToDollars(cents: number): number {
    return cents / 100;
  }
}

export default PaymentService;
