# SMS QUICKSTART GUIDE

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Get Twilio Credentials
1. Visit: https://www.twilio.com/console
2. Sign up (free trial included)
3. Copy **Account SID** and **Auth Token**
4. Buy a phone number
5. Copy the phone number in format: `+1234567890`

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
ENABLE_SMS=true
```

### 4. Start Server
```bash
npm run dev
```

### 5. Test SMS
Create a reservation via API - SMS will be sent automatically!

---

## CLI Commands

### Send Reminders (One Time)
```bash
npm run jobs:reminders
```

### Send Reminders (Continuous - Every Hour)
```bash
npm run jobs:reminders:cron
```

### Run Tests
```bash
npm test -- sms.service.test.ts
```

---

## Automatic SMS Triggers

### 1. Reservation Created → SMS Confirmation
```
Hola Juan,
Tu reserva ha sido confirmada:
- Barbero: Carlos
- Servicio: Corte Clásico
- Fecha: 15 de agosto de 2025
- Hora: 10:00
¡Te esperamos!
```

### 2. Reservation Cancelled → SMS Notification
```
Hola Juan,
Tu reserva ha sido cancelada:
- Barbero: Carlos
- Servicio: Corte Clásico
- Fecha: 15 de agosto de 2025
- Hora: 10:00
Si tienes preguntas, contáctanos.
```

### 3. Job Runs Hourly → SMS Reminder
```
¡Hola Juan!
Recordatorio: Tu cita es mañana a las 10:00 con Carlos para Corte Clásico.
Confirma o cancela en nuestra app si es necesario.
```

---

## Quick API Examples

### Create Reservation (Sends SMS)
```bash
POST /api/reservations
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "barberId": "barber-123",
  "serviceId": "service-456",
  "appointmentDate": "2025-08-15",
  "startTime": "10:00"
}
```

### Cancel Reservation (Sends SMS)
```bash
DELETE /api/reservations/reservation-123
Authorization: Bearer YOUR_TOKEN
```

---

## Troubleshooting

### SMS Not Sending?
1. Check `.env` has correct credentials
2. Check `ENABLE_SMS=true`
3. Check Twilio account has credits
4. Check phone number format: `+1` prefix required

### Invalid Phone Number?
- Format: `+1 (555) 123-4567` or `+15551234567`
- Must include country code
- Service auto-normalizes formats

### Test Without Real SMS?
Set in `.env`:
```env
ENABLE_SMS=false
```

---

## File Reference

| File | Purpose |
|------|---------|
| `src/config/sms.ts` | Twilio config & templates |
| `src/services/sms.service.ts` | Core SMS logic |
| `src/jobs/reminders.job.ts` | Hourly reminder job |
| `src/__tests__/services/sms.service.test.ts` | 29 test cases |
| `SMS_SETUP.md` | Complete documentation |

---

## Full Documentation

For comprehensive guide: See `SMS_SETUP.md`

For implementation details: See `SMS_IMPLEMENTATION_SUMMARY.md`

For checklist: See `IMPLEMENTATION_CHECKLIST.md`

---

**Ready to go! 🚀**
