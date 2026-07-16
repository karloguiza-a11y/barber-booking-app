# SMS Setup Guide - Twilio Integration

## Overview
This guide provides instructions for setting up SMS notifications using Twilio in the barber-booking-app.

## Requirements
- Twilio Account
- Node.js 18+
- npm or yarn

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install twilio node-cron
npm install --save-dev @types/node-cron
```

### 2. Create Twilio Account
1. Go to [Twilio Console](https://www.twilio.com/console)
2. Sign up for a free account (includes trial credits)
3. Navigate to Account Settings
4. Find your Account SID and Auth Token

### 3. Get a Twilio Phone Number
1. In the Twilio Console, go to "Phone Numbers" → "Manage"
2. Click "Buy a Number"
3. Select a number and purchase it
4. Copy the phone number in E.164 format (e.g., +1234567890)

## Environment Variables

Add the following variables to your `.env` file:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
ENABLE_SMS=true
```

### Configuration Details
- `TWILIO_ACCOUNT_SID`: Your unique Twilio account identifier
- `TWILIO_AUTH_TOKEN`: Your authentication token (keep this secret!)
- `TWILIO_PHONE_NUMBER`: Your purchased Twilio phone number
- `ENABLE_SMS`: Set to `true` to enable SMS, `false` to disable

## Features

### 1. SMS Notifications
The system automatically sends SMS notifications for:

#### Reservation Confirmation
- **Trigger**: When a reservation is created
- **Content**: Includes barber name, service, date, time
- **Language**: Spanish

Example Message:
```
Hola Juan,

Tu reserva ha sido confirmada:
- Barbero: Carlos
- Servicio: Corte Clásico
- Fecha: 15 de agosto de 2025
- Hora: 10:00

¡Te esperamos!
```

#### Reservation Cancellation
- **Trigger**: When a reservation is cancelled
- **Content**: Includes cancellation details

Example Message:
```
Hola Juan,

Tu reserva ha sido cancelada:
- Barbero: Carlos
- Servicio: Corte Clásico
- Fecha: 15 de agosto de 2025
- Hora: 10:00

Si tienes preguntas, contáctanos.
```

#### 24-Hour Reminder
- **Trigger**: Automatically sent 24 hours before appointment
- **Content**: Reminder about upcoming appointment

Example Message:
```
¡Hola Juan!

Recordatorio: Tu cita es mañana a las 10:00 con Carlos para Corte Clásico.

Confirma o cancela en nuestra app si es necesario.
```

### 2. Phone Number Validation
The SMS service validates phone numbers in multiple formats:
- E.164 format: `+12025551234`
- Standard US: `2025551234`
- With formatting: `(202) 555-1234`, `202-555-1234`
- With spaces: `202 555 1234`

### 3. Error Handling
- SMS failures don't block reservation operations
- Errors are logged for monitoring
- Messages are in Spanish for Latin American customers

## Usage

### Running Reminders Job

#### Manual Run
```bash
npm run jobs:reminders
```

This runs the reminder job once and exits.

#### Continuous Cron
```bash
npm run jobs:reminders:cron
```

This keeps the job running continuously, executing every hour to send 24-hour reminders.

### SMS Service API

#### Send Confirmation
```typescript
import { smsService } from './services/sms.service';

const success = await smsService.sendReservationConfirmation(
  '+12025551234',
  {
    id: 'res-123',
    clientName: 'Juan Pérez',
    clientPhone: '+12025551234',
    barberName: 'Carlos',
    serviceName: 'Corte Clásico',
    appointmentDate: new Date('2025-08-15'),
    startTime: '10:00'
  }
);
```

#### Send Cancellation
```typescript
const success = await smsService.sendReservationCancellation(
  '+12025551234',
  reservationData
);
```

#### Send Reminder
```typescript
const success = await smsService.send24HourReminder(
  '+12025551234',
  reservationData
);
```

#### Send Generic SMS
```typescript
const success = await smsService.sendGenericSMS(
  '+12025551234',
  'Your custom message here'
);
```

## Configuration Files

### `src/config/sms.ts`
- Twilio client initialization
- SMS templates management
- Phone number validation

### `src/services/sms.service.ts`
- Core SMS sending functionality
- Template rendering
- Phone number normalization

### `src/jobs/reminders.job.ts`
- Cron job for 24-hour reminders
- Database query for upcoming reservations
- Reminder dispatch

## Testing

Run the SMS service tests:
```bash
npm test -- sms.service.test.ts
```

Tests cover:
- Phone number validation (various formats)
- Phone number normalization
- SMS template rendering
- Error handling
- Message type variations

## Troubleshooting

### SMS Not Sending
1. **Check Environment Variables**: Verify all Twilio credentials are correct
2. **Check ENABLE_SMS**: Ensure `ENABLE_SMS=true`
3. **Check Phone Number**: Verify the client's phone number is valid
4. **Check Twilio Balance**: Ensure your account has credits

### Invalid Phone Numbers
- Ensure phone numbers include country code
- Remove common separators (-()/.)
- The service automatically normalizes and validates

### Authentication Errors
- Verify Account SID is correct
- Verify Auth Token is correct and not expired
- Check Twilio dashboard for account restrictions

### Rate Limiting
- Twilio has rate limits on free accounts
- Consider upgrading if sending many messages
- Implement retry logic for failures

## Security Considerations

1. **Never commit `.env`** with real credentials
2. **Use environment variables** for all sensitive data
3. **Rotate auth tokens** periodically
4. **Monitor Twilio logs** for suspicious activity
5. **Validate phone numbers** before storing

## Cost Management

### Free Trial
- Twilio free account includes trial credits
- Test thoroughly before going to production
- Monitor usage in Twilio dashboard

### Production
- SMS costs approximately $0.0075 per message (varies by region)
- Disable SMS if not needed: Set `ENABLE_SMS=false`
- Monitor daily usage and costs

## API Integration

### Endpoints That Trigger SMS

#### POST /api/reservations
- Triggers: Confirmation SMS
- User: Client
- Automatic: Yes

#### DELETE /api/reservations/{id}
- Triggers: Cancellation SMS
- User: Client
- Automatic: Yes

#### Reminders Job (Hourly)
- Triggers: 24-hour reminder SMS
- User: Client with appointment tomorrow
- Automatic: Yes (if cron job running)

## Migration from Email-Only

If migrating from email-only notifications:

1. Install dependencies
2. Configure Twilio credentials in `.env`
3. Set `ENABLE_SMS=true`
4. Restart server - SMS will now be sent alongside emails
5. Monitor logs for errors

## Support

For issues:
1. Check Twilio logs: https://www.twilio.com/console/logs
2. Check application logs
3. Verify phone numbers and credentials
4. Test with a known working number
