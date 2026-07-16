import { PaymentStatus as PrismaPaymentStatus } from '@prisma/client';

export type PaymentProvider = 'stripe' | 'paypal';

export type PaymentStatus = PrismaPaymentStatus;

export interface PaymentMetadata {
  reservationId: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  appointmentDate: string;
  clientEmail?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface CreatePaymentRequest {
  reservationId: string;
  amount: number; // in cents
  currency: string;
}

export interface CreateStripeIntentRequest extends CreatePaymentRequest {
  provider: 'stripe';
}

export interface CreatePayPalOrderRequest extends CreatePaymentRequest {
  provider: 'paypal';
}

export interface ConfirmPaymentRequest {
  paymentId: string;
  provider: PaymentProvider;
}

export interface RefundPaymentRequest {
  reason?: string;
}

export interface PaymentResponse {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  stripePaymentIntentId?: string;
  paypalOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StripePaymentIntentResponse {
  paymentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface PayPalOrderResponse {
  paymentId: string;
  orderId: string;
  links: Array<{
    rel: string;
    href: string;
    method?: string;
  }>;
}

export interface PaymentStatusResponse {
  payment: PaymentResponse;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

export interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource: {
    id: string;
    status: string;
    [key: string]: any;
  };
}

export interface PaymentError {
  message: string;
  code?: string;
  statusCode?: number;
}
