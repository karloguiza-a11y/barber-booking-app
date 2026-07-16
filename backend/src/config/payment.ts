import Stripe from 'stripe';
import paypal from 'paypal-checkout-server-sdk';

// ===== PAYMENT CONFIGURATION =====

export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
};

export const paypalConfig = {
  mode: (process.env.PAYPAL_MODE || 'sandbox') as 'sandbox' | 'live',
  clientId: process.env.PAYPAL_CLIENT_ID || '',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  webhookId: process.env.PAYPAL_WEBHOOK_ID || '',
};

export const paymentConfig = {
  defaultCurrency: (process.env.DEFAULT_CURRENCY || 'USD') as string,
  webhookToleranceMs: parseInt(process.env.PAYMENT_WEBHOOK_TOLERANCE_MS || '300000', 10),
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'MXN'],
  supportedProviders: ['stripe', 'paypal'] as const,
};

// ===== STRIPE INITIALIZATION =====

export const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: '2023-10-16',
});

// ===== PAYPAL INITIALIZATION =====

const paypalEnvironment =
  paypalConfig.mode === 'live'
    ? new paypal.core.LiveEnvironment(paypalConfig.clientId, paypalConfig.clientSecret)
    : new paypal.core.SandboxEnvironment(paypalConfig.clientId, paypalConfig.clientSecret);

export const paypalClient = new paypal.core.PayPalHttpClient(paypalEnvironment);

// ===== PAYMENT TYPES =====

export type PaymentProvider = 'stripe' | 'paypal';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  clientSecret?: string;
  status: PaymentStatus;
}

export interface PaymentMetadata {
  reservationId: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  appointmentDate: string;
  [key: string]: string | number | boolean;
}

export interface StripePaymentIntentResult {
  id: string;
  status: string;
  amount: number;
  currency: string;
  client_secret: string;
}

export interface PayPalOrderResult {
  id: string;
  status: string;
}

// ===== VALIDATION CONSTANTS =====

export const PAYMENT_VALIDATION = {
  MIN_AMOUNT: 1, // 1 cent
  MAX_AMOUNT: 999999999, // $9,999,999.99
};
