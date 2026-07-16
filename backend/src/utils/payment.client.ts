import PaymentService from '../services/payment.service';

/**
 * Frontend Integration Guide for Payment System
 * 
 * This guide shows how to integrate Stripe and PayPal payments
 * from the frontend of the barber-booking-app
 */

// ===== STRIPE PAYMENT FLOW =====

export interface StripePaymentConfig {
  publishableKey: string;
}

/**
 * Step 1: Create Stripe Payment Intent
 * This should be called when user clicks "Pay with Stripe"
 */
export async function createStripePaymentIntent(
  reservationId: string,
  amount: number, // in cents
  currency: string
): Promise<{
  paymentId: string;
  clientSecret: string;
}> {
  const response = await fetch('/api/payments/stripe/create-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      reservationId,
      amount,
      currency
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  return response.json();
}

/**
 * Step 2: Confirm Stripe Payment with Stripe.js
 * This uses the @stripe/stripe-js library
 */
export async function confirmStripePayment(
  stripe: any, // Stripe instance from @stripe/stripe-js
  clientSecret: string,
  cardElement: any // Card element from Stripe
): Promise<{
  paymentIntent: any;
}> {
  const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
      billing_details: {
        // Add billing details as needed
      }
    }
  });

  if (error) {
    throw error;
  }

  return { paymentIntent };
}

/**
 * Step 3: Confirm Payment on Backend
 */
export async function confirmPaymentOnBackend(
  paymentId: string,
  provider: 'stripe' | 'paypal'
): Promise<any> {
  const response = await fetch('/api/payments/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      paymentId,
      provider
    })
  });

  if (!response.ok) {
    throw new Error('Failed to confirm payment');
  }

  return response.json();
}

// ===== PAYPAL PAYMENT FLOW =====

/**
 * Step 1: Create PayPal Order
 * This should be called when user clicks "Pay with PayPal"
 */
export async function createPayPalOrder(
  reservationId: string,
  amount: number, // in cents
  currency: string
): Promise<{
  paymentId: string;
  orderId: string;
  links: Array<{
    rel: string;
    href: string;
    method?: string;
  }>;
}> {
  const response = await fetch('/api/payments/paypal/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      reservationId,
      amount,
      currency
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create PayPal order');
  }

  return response.json();
}

/**
 * Step 2: Redirect to PayPal Approval
 */
export function redirectToPayPalApproval(links: any[]): void {
  const approveLink = links.find(link => link.rel === 'approve');
  if (approveLink) {
    window.location.href = approveLink.href;
  }
}

/**
 * Step 3: Capture PayPal Payment
 * This is called after user approves and returns
 */
export async function capturePayPalPayment(
  paymentId: string
): Promise<any> {
  return confirmPaymentOnBackend(paymentId, 'paypal');
}

// ===== UTILITY FUNCTIONS =====

/**
 * Check Payment Status
 */
export async function getPaymentStatus(paymentId: string): Promise<any> {
  const response = await fetch(`/api/payments/${paymentId}/status`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get payment status');
  }

  return response.json();
}

/**
 * Refund a Payment
 */
export async function refundPayment(
  paymentId: string,
  reason?: string
): Promise<any> {
  const response = await fetch(`/api/payments/${paymentId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ reason })
  });

  if (!response.ok) {
    throw new Error('Failed to refund payment');
  }

  return response.json();
}

/**
 * Convert dollars to cents
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

// ===== REACT COMPONENT EXAMPLES =====

/**
 * Example React Hook for Stripe Payment
 */
export const useStripePayment = () => {
  return {
    createPaymentIntent: createStripePaymentIntent,
    confirmPayment: confirmStripePayment,
    confirmOnBackend: confirmPaymentOnBackend,
  };
};

/**
 * Example React Hook for PayPal Payment
 */
export const usePayPalPayment = () => {
  return {
    createOrder: createPayPalOrder,
    redirectToApproval: redirectToPayPalApproval,
    capturePayment: capturePayPalPayment,
  };
};

export default {
  stripe: {
    createPaymentIntent,
    confirmPayment,
  },
  paypal: {
    createOrder,
    redirectToApproval,
    capturePayment,
  },
  common: {
    confirmPaymentOnBackend,
    getPaymentStatus,
    refundPayment,
    dollarsToCents,
    centsToDollars,
  }
};
