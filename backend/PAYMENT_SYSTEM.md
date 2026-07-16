# Payment System Documentation

## Overview

The barber-booking-app includes a comprehensive payment system supporting both Stripe and PayPal. The system handles payment intents, order creation, confirmation, and refunds.

## Setup

### Environment Variables

Add the following to your `.env` file:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here

# PayPal
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_WEBHOOK_ID=your_webhook_id

# General
DEFAULT_CURRENCY=USD
PAYMENT_WEBHOOK_TOLERANCE_MS=300000
```

### Database Migration

Run the payment migration:

```bash
npm run db:migrate:payment
```

## API Endpoints

### Stripe Payments

#### Create Stripe Payment Intent

```
POST /api/payments/stripe/create-intent
```

**Request:**
```json
{
  "reservationId": "res_123",
  "amount": 5000,
  "currency": "USD"
}
```

**Response:**
```json
{
  "paymentId": "pay_123",
  "clientSecret": "pi_test123_secret",
  "amount": 5000,
  "currency": "USD"
}
```

**Usage (Frontend):**
```javascript
// 1. Create payment intent
const response = await fetch('/api/payments/stripe/create-intent', {
  method: 'POST',
  body: JSON.stringify({
    reservationId: 'res_123',
    amount: 5000,
    currency: 'USD'
  })
});

const { clientSecret, paymentId } = await response.json();

// 2. Use Stripe.js to confirm payment
const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement
  }
});

// 3. Confirm payment on backend
await fetch('/api/payments/confirm', {
  method: 'POST',
  body: JSON.stringify({
    paymentId,
    provider: 'stripe'
  })
});
```

### PayPal Payments

#### Create PayPal Order

```
POST /api/payments/paypal/create-order
```

**Request:**
```json
{
  "reservationId": "res_123",
  "amount": 5000,
  "currency": "USD"
}
```

**Response:**
```json
{
  "paymentId": "pay_123",
  "orderId": "order_123",
  "links": [
    {
      "rel": "approve",
      "href": "https://www.paypal.com/..."
    }
  ]
}
```

**Usage (Frontend):**
```javascript
// 1. Create PayPal order
const response = await fetch('/api/payments/paypal/create-order', {
  method: 'POST',
  body: JSON.stringify({
    reservationId: 'res_123',
    amount: 5000,
    currency: 'USD'
  })
});

const { paymentId, orderId, links } = await response.json();

// 2. Redirect user to PayPal approval URL
const approveLink = links.find(link => link.rel === 'approve');
window.location.href = approveLink.href;

// 3. After user approves and returns, confirm payment
await fetch('/api/payments/confirm', {
  method: 'POST',
  body: JSON.stringify({
    paymentId,
    provider: 'paypal'
  })
});
```

### Confirm Payment

```
POST /api/payments/confirm
```

**Request:**
```json
{
  "paymentId": "pay_123",
  "provider": "stripe"
}
```

**Response:**
```json
{
  "payment": {
    "id": "pay_123",
    "status": "COMPLETED",
    ...
  }
}
```

### Refund Payment

```
POST /api/payments/{id}/refund
```

**Request:**
```json
{
  "reason": "customer_request"
}
```

**Response:**
```json
{
  "payment": {
    "id": "pay_123",
    "status": "REFUNDED",
    ...
  }
}
```

### Get Payment Status

```
GET /api/payments/{id}/status
```

**Response:**
```json
{
  "payment": {
    "id": "pay_123",
    "reservationId": "res_123",
    "amount": 5000,
    "currency": "USD",
    "status": "COMPLETED",
    "provider": "stripe",
    "createdAt": "2025-01-01T12:00:00Z",
    "updatedAt": "2025-01-01T12:05:00Z"
  }
}
```

## Webhooks

### Stripe Webhook

The system automatically handles Stripe webhooks at:
```
POST /api/webhooks/stripe
```

**Handled Events:**
- `payment_intent.succeeded` - Updates payment status to COMPLETED and confirms reservation
- `payment_intent.payment_failed` - Updates payment status to FAILED
- `charge.refunded` - Updates payment status to REFUNDED

**Setup in Stripe Dashboard:**
1. Go to Settings → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### PayPal Webhook

The system automatically handles PayPal webhooks at:
```
POST /api/webhooks/paypal
```

**Handled Events:**
- `CHECKOUT.ORDER.COMPLETED` - Updates payment status to COMPLETED and confirms reservation
- `CHECKOUT.ORDER.APPROVED` - Logs approval (typically handled client-side)
- `PAYMENT.CAPTURE.REFUNDED` - Handles refund notifications

**Setup in PayPal Dashboard:**
1. Go to App & Credentials
2. Create webhook endpoint: `https://yourdomain.com/api/webhooks/paypal`
3. Select events: `CHECKOUT.ORDER.COMPLETED`, `CHECKOUT.ORDER.APPROVED`
4. Copy the webhook ID to `PAYPAL_WEBHOOK_ID`

## PaymentService API

### Methods

#### validateAmount(amount: number): boolean
Validates that the amount is a valid integer in cents.

```typescript
try {
  PaymentService.validateAmount(5000); // $50.00
} catch (error) {
  console.error('Invalid amount');
}
```

#### validateCurrency(currency: string): boolean
Validates that the currency is supported.

```typescript
try {
  PaymentService.validateCurrency('USD');
} catch (error) {
  console.error('Currency not supported');
}
```

#### createStripePaymentIntent(amount, currency, metadata)
Creates a Stripe payment intent. Returns a Stripe PaymentIntent object.

#### createPayPalOrder(amount, currency, metadata, returnUrl, cancelUrl)
Creates a PayPal order. Returns a PayPal Order object.

#### confirmStripePayment(paymentIntentId)
Retrieves and confirms a Stripe payment intent.

#### capturePayPalPayment(orderId)
Captures a PayPal order (completes the payment).

#### refundPayment(paymentId, reason)
Refunds a completed payment. Returns the updated Payment record.

#### getPaymentStatus(paymentId)
Retrieves the current status of a payment.

#### updatePaymentStatus(paymentId, status, metadata)
Updates the status of a payment record.

#### dollarsToCents(dollars: number): number
Converts dollars to cents.

```typescript
const cents = PaymentService.dollarsToCents(50.00); // 5000
```

#### centsToDollars(cents: number): number
Converts cents to dollars.

```typescript
const dollars = PaymentService.centsToDollars(5000); // 50.00
```

## Reservation Integration

### Creating a Reservation with Payment

The standard flow:

1. **Create Reservation** (PENDING status)
   - User creates a reservation
   - Reservation is created with status PENDING
   - No payment is automatically created

2. **Create Payment Intent/Order**
   - Frontend calls `/api/payments/stripe/create-intent` or `/api/payments/paypal/create-order`
   - Payment record is created in database with status PENDING

3. **Process Payment**
   - User completes payment via Stripe or PayPal

4. **Confirm Payment**
   - Frontend calls `/api/payments/confirm`
   - Payment status updated to COMPLETED
   - Reservation status updated to CONFIRMED
   - Webhooks also handle this (automatic)

5. **Cancellation with Refund**
   - User cancels reservation
   - System automatically refunds any COMPLETED payment
   - Reservation status updated to CANCELLED

## Error Handling

All payment endpoints include comprehensive error handling:

```typescript
try {
  const payment = await PaymentService.createStripePaymentIntent(...);
} catch (error) {
  // Errors include detailed messages
  // - Validation errors (amount, currency)
  // - API errors (Stripe/PayPal connection issues)
  // - Database errors
}
```

## Amount Format

All amounts in the API are in **cents** to avoid floating-point precision issues:

```
100 cents = $1.00
5000 cents = $50.00
999999999 cents = $9,999,999.99 (max)
```

## Supported Currencies

- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- MXN (Mexican Peso)

Additional currencies can be added in `src/config/payment.ts`.

## Testing

Run payment service tests:

```bash
npm test -- src/__tests__/services/payment.service.test.ts
```

For webhook testing, use Stripe/PayPal CLI:

```bash
# Stripe
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# PayPal
paypal-cli webhooks --listen --forward-to localhost:5000/api/webhooks/paypal
```

## Security Considerations

1. **API Keys**: Store Stripe and PayPal keys in environment variables only
2. **Webhook Verification**: All webhooks are verified using provider signatures
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Endpoints are rate-limited to prevent abuse
5. **Amount Validation**: Amounts are validated on both client and server
6. **Transaction IDs**: All transactions have unique IDs for tracking

## Production Checklist

- [ ] Set STRIPE_WEBHOOK_SECRET from production webhook
- [ ] Set PAYPAL_MODE to "live" for production
- [ ] Update PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET for production
- [ ] Update STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY for production
- [ ] Update PAYPAL_WEBHOOK_ID for production
- [ ] Update webhook URLs in Stripe/PayPal dashboards to production domain
- [ ] Enable HTTPS on production server
- [ ] Test all payment flows in production environment
- [ ] Set up monitoring/alerting for payment failures
- [ ] Document refund policies to users

## Troubleshooting

### Webhook not triggering

1. Check webhook URL is publicly accessible
2. Verify webhook secret is correctly configured
3. Check webhook event logs in Stripe/PayPal dashboard
4. Ensure server is running and responsive

### Payment confirmation failing

1. Verify payment intent/order ID is correct
2. Check payment status in database
3. Review error message for specific issue
4. Check Stripe/PayPal logs for API errors

### Refund failing

1. Verify payment is in COMPLETED status
2. Check refund limits with payment provider
3. Review error message for details
4. For PayPal, verify capture ID is stored

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [PayPal Documentation](https://developer.paypal.com/docs)
- [Stripe.js Reference](https://stripe.com/docs/js)
- [PayPal JavaScript SDK](https://developer.paypal.com/sdk/js/)
