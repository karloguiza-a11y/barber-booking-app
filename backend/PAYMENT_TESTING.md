# Payment System Testing Guide

## Unit Tests

Run the payment service unit tests:

```bash
npm test -- src/__tests__/services/payment.service.test.ts
```

## Integration Tests

### Setup Test Environment

```bash
# Create a test .env file
cp .env.example .env.test

# Update with Stripe test keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Test Stripe Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# In another terminal, trigger test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
```

### Test PayPal Webhooks Locally

```bash
# Use ngrok to expose local server
ngrok http 5000

# Update PayPal webhook URL to ngrok URL
# https://xxxx-xx-xxx-xxx-xxx.ngrok.io/api/webhooks/paypal
```

## Manual Testing

### Test Payment Intent Creation

```bash
curl -X POST http://localhost:5000/api/payments/stripe/create-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reservationId": "res_123",
    "amount": 5000,
    "currency": "USD"
  }'
```

### Test PayPal Order Creation

```bash
curl -X POST http://localhost:5000/api/payments/paypal/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reservationId": "res_123",
    "amount": 5000,
    "currency": "USD"
  }'
```

### Test Payment Confirmation

```bash
curl -X POST http://localhost:5000/api/payments/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "paymentId": "pay_123",
    "provider": "stripe"
  }'
```

### Test Payment Status

```bash
curl -X GET http://localhost:5000/api/payments/pay_123/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Refund

```bash
curl -X POST http://localhost:5000/api/payments/pay_123/refund \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reason": "customer_request"
  }'
```

## End-to-End Testing

### Complete Stripe Flow

1. **Create Reservation**
   ```bash
   curl -X POST http://localhost:5000/api/reservations \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "barberId": "barber_123",
       "serviceId": "service_123",
       "appointmentDate": "2025-01-15",
       "startTime": "10:00"
     }'
   ```

2. **Create Payment Intent**
   ```bash
   # Copy reservationId from step 1
   curl -X POST http://localhost:5000/api/payments/stripe/create-intent \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "reservationId": "res_from_step_1",
       "amount": 5000,
       "currency": "USD"
     }'
   ```

3. **Process Payment (using Stripe test card)**
   - Use Stripe.js or test in Stripe dashboard
   - Test card: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVC: 123

4. **Confirm Payment**
   ```bash
   curl -X POST http://localhost:5000/api/payments/confirm \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "paymentId": "pay_from_step_2",
       "provider": "stripe"
     }'
   ```

5. **Verify Reservation Status Changed to CONFIRMED**
   ```bash
   curl -X GET http://localhost:5000/api/reservations/res_from_step_1 \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

### Complete PayPal Flow

1. **Create Reservation** (same as Stripe)

2. **Create PayPal Order**
   ```bash
   curl -X POST http://localhost:5000/api/payments/paypal/create-order \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "reservationId": "res_from_step_1",
       "amount": 5000,
       "currency": "USD"
     }'
   ```

3. **Approve Order**
   - Click the approval link from step 2
   - Log in with sandbox PayPal account
   - Approve the payment

4. **Capture Payment**
   ```bash
   curl -X POST http://localhost:5000/api/payments/confirm \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "paymentId": "pay_from_step_2",
       "provider": "paypal"
     }'
   ```

## Stripe Test Cards

| Use Case | Card Number | Expiry | CVC |
|----------|-------------|--------|-----|
| Successful payment | 4242 4242 4242 4242 | 12/25 | 123 |
| Declined | 4000 0000 0000 0002 | 12/25 | 123 |
| Insufficient funds | 4000 0000 0000 9995 | 12/25 | 123 |
| 3D Secure required | 4000 0000 0000 3220 | 12/25 | 123 |
| Expired card | 4000 0000 0000 0069 | 12/17 | 123 |

## PayPal Sandbox Accounts

### Business Account (Merchant)
- Email: sb-merchant@example.com
- Password: (set up in sandbox)

### Personal Account (Buyer)
- Email: sb-buyer@example.com
- Password: (set up in sandbox)

## Debugging

### Enable Debug Logging

Add to payment.service.ts:

```typescript
console.debug('Creating payment intent:', { amount, currency, metadata });
```

### Monitor Database

```bash
# Open Prisma Studio to inspect payment records
npm run db:studio
```

### Check Webhook Logs

```bash
# Stripe CLI logs
stripe logs tail

# PayPal webhook logs (via dashboard)
# Settings → Webhooks → View logs
```

## Performance Testing

### Load Testing Payments

```bash
# Install k6
brew install k6

# Run load test
k6 run payment-load-test.js
```

Example load test script (payment-load-test.js):

```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  const data = {
    reservationId: 'res_123',
    amount: 5000,
    currency: 'USD',
  };

  const response = http.post('http://localhost:5000/api/payments/stripe/create-intent', JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${__ENV.JWT_TOKEN}`,
    },
  });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## Troubleshooting Tests

### "Invalid API Key" Error

- Verify STRIPE_SECRET_KEY in .env
- Ensure key starts with `sk_test_` for test mode
- Check key hasn't expired in Stripe dashboard

### "Signature verification failed"

- Verify STRIPE_WEBHOOK_SECRET is correct
- Ensure webhook body is not JSON-stringified twice
- Check webhook headers include `stripe-signature`

### PayPal timeout issues

- Verify PAYPAL_MODE is set to 'sandbox' for testing
- Check PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET
- Ensure network allows PayPal API calls

### Database connection issues

- Verify DATABASE_URL is correct
- Check database is running
- Ensure user has permissions to access database

## CI/CD Testing

### GitHub Actions Example

```yaml
name: Payment Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run payment tests
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
          PAYPAL_CLIENT_ID: ${{ secrets.PAYPAL_CLIENT_ID }}
        run: npm test -- payment.service.test.ts
```

## Success Criteria

✅ All unit tests pass  
✅ Integration tests complete without errors  
✅ Webhooks successfully processed  
✅ Reservation status updated correctly after payment  
✅ Refunds process successfully  
✅ Database records accurate  
✅ Error handling graceful  
✅ Performance acceptable under load  
