# 🚀 QUICK DEPLOYMENT STEPS - v1.1.0

## Pasos Rápidos para Lanzar a Producción

### PASO 1️⃣: CREAR RELEASE EN GITHUB (5 minutos)

```
1. Ve a: https://github.com/karloguiza-a11y/barber-booking-app/releases
2. Click "Draft a new release"
3. Tag: v1.1.0
4. Title: v1.1.0 - SMS, Payments, Reviews & Swagger
5. Description: Copy from RELEASE_NOTES_v1.1.0.md
6. Click "Publish release"

✅ Release creado
```

---

### PASO 2️⃣: MERGE BRANCHES A MAIN (10 minutos)

En GitHub o terminal, hacer merge en este ORDEN:

```bash
# 1. feat-swagger-api-docs
git checkout main
git pull origin main
git merge origin/feat-swagger-api-docs --no-ff
git push origin main
✅ Merge 1/5 complete

# 2. feat-sms-notifications
git checkout main
git pull origin main
git merge origin/feat-sms-notifications --no-ff
git push origin main
✅ Merge 2/5 complete

# 3. feat-payment-integration
git checkout main
git pull origin main
git merge origin/feat-payment-integration --no-ff
git push origin main
✅ Merge 3/5 complete

# 4. feat-reviews-ratings
git checkout main
git pull origin main
git merge origin/feat-reviews-ratings --no-ff
git push origin main
✅ Merge 4/5 complete

# 5. v1.1.0-release
git checkout main
git pull origin main
git merge origin/v1.1.0-release --no-ff
git push origin main
git tag v1.1.0
git push origin v1.1.0
✅ Merge 5/5 complete - All features on main!
```

---

### PASO 3️⃣: STAGING DEPLOYMENT (30 minutos)

```bash
# En servidor staging:
cd /var/www/barber-booking-app

git fetch origin
git checkout v1.1.0
git pull origin v1.1.0

# Copiar env
cp backend/.env.example backend/.env
# ⚠️ EDITAR backend/.env con credenciales STAGING

# Instalar & build
cd backend
npm install --production=false
npm run build
npm run type-check

# Frontend
cd ../frontend
npm install --production=false
npm run build

# DB migration
cd ../backend
npm run db:migrate

# Start services
npm run dev &  # Backend en background
cd ../frontend
npm run dev &  # Frontend en background

# Verificar
sleep 5
curl http://localhost:5000/health
curl http://localhost:3000

✅ Staging running!
```

---

### PASO 4️⃣: TESTING EN STAGING (20 minutos)

```bash
# Quick tests:

# 1. API Health
curl -X GET http://localhost:5000/health
# Expected: {"success": true, "message": "Server is running"}

# 2. Swagger UI
curl -X GET http://localhost:5000/api/docs
# Expected: HTML page with Swagger UI

# 3. Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@staging.com", "password": "Test123456", "name": "Test"}'

# 4. Run test suite
cd backend
npm test
# Expected: 95+ tests passing

# 5. Check database
psql -h staging-db -U user -d barber_booking_staging
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Payment";
SELECT COUNT(*) FROM "Review";
\q

✅ All tests passed!
```

---

### PASO 5️⃣: PRODUCTION DEPLOYMENT (45 minutos)

```bash
# ⚠️ CRITICAL: BACKUP FIRST!
# En servidor de producción:

# Backup base de datos
pg_dump -h prod-db -U user -d barber_booking > backup_v1.0.0.sql
# Guardar en lugar seguro

# Get v1.1.0
cd /var/www/barber-booking-app
git fetch origin
git checkout v1.1.0
git pull origin v1.1.0

# Setup env
cp backend/.env.example backend/.env
# ⚠️ EDITAR con credenciales PRODUCTION (NO TEST!)
# - STRIPE_SECRET_KEY (sk_live, no sk_test)
# - PAYPAL_MODE=live (no sandbox)
# - DATABASE_URL: producción
# - NODE_ENV=production

# Build
cd backend
npm install --production
npm run build
npm run type-check

cd ../frontend
npm install --production
npm run build

# CRITICAL: Database migration
cd ../backend
npm run db:migrate

# Verify migration
psql -h prod-db -U user -d barber_booking -c "SELECT COUNT(*) FROM \"Payment\";"

# Using PM2
pm2 start "npm run start" --name barber-api --cwd /var/www/barber-booking-app/backend
pm2 start "npm start" --name barber-web --cwd /var/www/barber-booking-app/frontend
pm2 save

# Verify
sleep 5
curl https://api.barberbooking.app/health
curl https://barberbooking.app

✅ Production running!
```

---

### PASO 6️⃣: POST-DEPLOYMENT VERIFICATION (10 minutos)

```bash
# Final checks:

# 1. Health check
curl -X GET https://api.barberbooking.app/health
# Expected: 200 OK

# 2. SSL certificate
openssl s_client -connect api.barberbooking.app:443
# Expected: "Verify return code: 0 (ok)"

# 3. Database
psql -h prod-db -U user -d barber_booking
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Payment";
SELECT COUNT(*) FROM "Review";
SELECT COUNT(*) FROM "Reservation";
\q

# 4. Smoke test - Register
curl -X POST https://api.barberbooking.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "prodtest@barberbooking.app", "password": "TestProd123", "name": "Prod Test"}'

# 5. View logs
pm2 logs barber-api --lines 20
pm2 logs barber-web --lines 20

# 6. Monitor processes
pm2 status

✅ All checks passed - v1.1.0 LIVE! 🎉
```

---

### PASO 7️⃣: MONITOREO Y ALERTAS (15 minutos)

```bash
# Setup monitoring:

# 1. PM2 monitoring
pm2 web  # Accesible en http://localhost:9615

# 2. Setup logs
pm2 logs barber-api
pm2 logs barber-web

# 3. Uptime monitoring
# Ir a: https://uptimerobot.com
# Crear monitors para:
# - https://barberbooking.app
# - https://api.barberbooking.app/health

# 4. Configure alertas en Slack/Email
# Setup webhook en PM2 o monitoreo tool

# 5. Setup backups automáticos
# Cada 6 horas:
pg_dump -h prod-db -U user -d barber_booking > /backups/barberbooking_$(date +%Y%m%d_%H%M%S).sql

✅ Monitoring active!
```

---

### PASO 8️⃣: NOTIFICAR AL EQUIPO (5 minutos)

```
Mensaje a Slack/Email/Teams:

🚀 BARBER BOOKING APP v1.1.0 LIVE!

✅ Production Deployment Complete

New Features:
- 📱 SMS Notifications (Twilio)
- 💳 Payment Processing (Stripe & PayPal)
- ⭐ Reviews & Ratings System
- 📚 Complete Swagger API Docs
- 🧪 95+ Automated Tests

Status:
- ✅ All services running
- ✅ Database migrated
- ✅ Monitoring active
- ✅ Backups configured

Endpoints:
- 🌐 https://barberbooking.app
- 📚 https://api.barberbooking.app/api/docs
- 💚 https://api.barberbooking.app/health

Support:
- Issues? Check DEPLOYMENT_GUIDE_v1.1.0.md
- Emergency? See rollback procedures

Let's celebrate! 🎉
```

---

## 📋 CHECKLIST RÁPIDO

```
☐ PASO 1: Release en GitHub creado
☐ PASO 2: 5 branches merged a main
☐ PASO 3: Staging deployed y corriendo
☐ PASO 4: Tests en staging pasando
☐ PASO 5: Producción deployed
☐ PASO 6: Post-deployment verified
☐ PASO 7: Monitoreo activo
☐ PASO 8: Equipo notificado

🎉 ¡v1.1.0 LANZADO A PRODUCCIÓN!
```

---

## ⚠️ PUNTOS CRÍTICOS

1. **ORDER MATTERS:** Merge en el orden especificado
2. **BACKUP FIRST:** SIEMPRE backup antes de migración en PROD
3. **TEST KEYS:** Usar sk_test para Stripe en staging, sk_live en prod
4. **ENV VARIABLES:** Revisar 2 veces antes de deploy
5. **DATABASE:** Esperar a que migration complete antes de restart
6. **MONITORING:** Configurar ANTES de considerar done

---

## 🆘 SI ALGO SALE MAL

### Rollback Rápido:
```bash
# Stop services
pm2 stop barber-api barber-web

# Volver a v1.0.0
git checkout v1.0.0
npm install --production
npm run build
npm run db:migrate --dry-run  # No ejecutar si no es necesario

# Restart
pm2 start barber-api barber-web

# Verify
curl https://api.barberbooking.app/health
```

### Database Rollback:
```bash
psql -h prod-db -U user -d barber_booking < backup_v1.0.0.sql
```

---

## 📞 RECURSOS

- **Deployment Guide:** DEPLOYMENT_GUIDE_v1.1.0.md
- **Release Notes:** RELEASE_NOTES_v1.1.0.md
- **API Docs:** https://api.barberbooking.app/api/docs
- **GitHub:** https://github.com/karloguiza-a11y/barber-booking-app

---

**Tiempo Total Estimado:** ~2 horas
**Tiempo por Paso:** 5-45 minutos
**Status:** ✅ READY TO DEPLOY

¡Éxito con el deployment! 🚀
