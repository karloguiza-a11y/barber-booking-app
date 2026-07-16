# 🚀 DEPLOYMENT GUIDE v1.1.0 - Barber Booking App

**Documento:** Guía completa para lanzar v1.1.0 a producción  
**Versión:** 1.1.0  
**Fecha:** 2026-07-16  
**Estado:** READY TO DEPLOY

---

## 📋 TABLA DE CONTENIDOS

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [GitHub Release Setup](#github-release-setup)
3. [Merge de Branches](#merge-de-branches)
4. [Deployment a Staging](#deployment-a-staging)
5. [Testing en Staging](#testing-en-staging)
6. [Deployment a Producción](#deployment-a-producción)
7. [Post-Deployment](#post-deployment)
8. [Rollback Plan](#rollback-plan)
9. [Monitoring](#monitoring)

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Antes de comenzar, asegúrate de:

### Code Quality
- [ ] Todos los tests pasan: `npm test`
- [ ] Build compila sin errores: `npm run build`
- [ ] Type checking pasó: `npm run type-check`
- [ ] Linting pasó: `npm run lint`
- [ ] No hay warnings en console

### Documentation
- [ ] CHANGELOG.md actualizado
- [ ] RELEASE_NOTES_v1.1.0.md completo
- [ ] API documentation actualizada
- [ ] README.md actual

### Security
- [ ] No hay secrets en código
- [ ] JWT_SECRET configurado
- [ ] STRIPE_SECRET_KEY guardado
- [ ] PAYPAL_SECRET guardado
- [ ] TWILIO_AUTH_TOKEN guardado
- [ ] Webhook secrets verificados

### Environment
- [ ] .env.example actualizado
- [ ] Todas las variables documentadas
- [ ] No hay hardcoded URLs
- [ ] Production config listo

### Database
- [ ] Migrations probadas localmente
- [ ] Seed script funcionando
- [ ] Backups configurados
- [ ] Connection strings documentadas

---

## 🔖 GITHUB RELEASE SETUP

### Paso 1: Crear Release en GitHub

```bash
# Ve a GitHub Repository
# https://github.com/karloguiza-a11y/barber-booking-app

# Click en "Releases" en la sidebar
# Click en "Draft a new release"

# Rellena los siguientes campos:
Tag version: v1.1.0
Release title: v1.1.0 - SMS, Payments, Reviews & API Docs
Previous tag: v1.0.0
Auto-generate release notes: NO (usar manual)

# Descripción del Release:

---
Release v1.1.0 - Production Ready

## 🎉 Major Features

✅ SMS Notifications (Twilio)
- Automatic confirmation SMS
- Cancellation notifications
- 24-hour reminders

✅ Payment Processing (Stripe & PayPal)
- Full payment flow
- Webhook handlers
- Automatic refunds

✅ Reviews & Ratings System
- Verified reviews post-reservation
- 1-5 star ratings
- Helpful/unhelpful voting

✅ Swagger/OpenAPI Documentation
- Complete API documentation
- 42+ endpoints documented
- Interactive UI

✅ Jest Testing Framework
- 95+ test cases
- 70%+ code coverage
- CI/CD ready

## 📊 Statistics
- 50+ files created/modified
- 15,000+ lines of code
- 250+ KB documentation
- 5 production branches

## 🔗 Branches
- feat-swagger-api-docs
- feat-sms-notifications
- feat-payment-integration
- feat-reviews-ratings
- v1.1.0-release

## 📚 Documentation
- RELEASE_NOTES_v1.1.0.md
- PROJECT_COMPLETION_SUMMARY.md
- DEPLOYMENT_GUIDE_v1.1.0.md

## ✅ Status
Production Ready - Ready to Deploy

---
```

Click "Publish release"

---

## 🔄 MERGE DE BRANCHES

### Paso 2: Merge en orden a main

**Importante:** Hacer merge en este orden específico para evitar conflictos.

#### 2.1 Merge feat-swagger-api-docs (Base de todo)

```bash
# En GitHub (o localmente):
git checkout main
git pull origin main

# Opción A: GitHub UI
# 1. Ve a Pull Requests
# 2. Click en "feat-swagger-api-docs"
# 3. Click "Create pull request"
# 4. Espera a que pasen las checks
# 5. Click "Squash and merge"

# Opción B: Terminal
git merge origin/feat-swagger-api-docs --no-ff
git push origin main
```

✅ **Status:** Swagger + Tests merged a main

#### 2.2 Merge feat-sms-notifications

```bash
# Espera a que el PR anterior esté merged
git checkout main
git pull origin main
git merge origin/feat-sms-notifications --no-ff
git push origin main
```

✅ **Status:** SMS features merged a main

#### 2.3 Merge feat-payment-integration

```bash
git checkout main
git pull origin main
git merge origin/feat-payment-integration --no-ff
git push origin main
```

✅ **Status:** Payment processing merged a main

#### 2.4 Merge feat-reviews-ratings

```bash
git checkout main
git pull origin main
git merge origin/feat-reviews-ratings --no-ff
git push origin main
```

✅ **Status:** Reviews system merged a main

#### 2.5 Merge v1.1.0-release (Documentation & Release Notes)

```bash
git checkout main
git pull origin main
git merge origin/v1.1.0-release --no-ff
git push origin main
```

✅ **Status:** v1.1.0 completamente merged a main

### Verificar merge completado

```bash
git checkout main
git log --oneline -10
# Deberías ver todos los commits de las features

git tag v1.1.0
git push origin v1.1.0
```

---

## 🧪 DEPLOYMENT A STAGING

### Paso 3: Preparar servidor de staging

#### 3.1 Obtener últimos cambios

```bash
# En servidor de staging:
cd /var/www/barber-booking-app

git fetch origin
git checkout main
git pull origin main
git checkout v1.1.0  # o git reset --hard origin/main
```

#### 3.2 Configurar variables de ambiente

```bash
# Copiar .env.example a .env
cp backend/.env.example backend/.env

# Editar backend/.env con credenciales de STAGING:
```

**Variables requeridas:**

```bash
# Database
DATABASE_URL=postgresql://user:password@staging-db:5432/barber_booking_staging

# JWT
JWT_SECRET=your-staging-jwt-secret-min-32-chars

# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_staging
TWILIO_PHONE_NUMBER=+1234567890
ENABLE_SMS=true

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# PayPal
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_WEBHOOK_ID=xxxxxxxxxxxxxxxxxxxx

# Frontend
FRONTEND_URL=https://staging.barberbooking.app
NEXT_PUBLIC_API_URL=https://api.staging.barberbooking.app

# Other
NODE_ENV=staging
LOG_LEVEL=debug
ENABLE_DEBUG=true
```

#### 3.3 Instalar dependencias

```bash
# Backend
cd backend
npm install --production=false
npm run build
npm run type-check

# Frontend
cd ../frontend
npm install --production=false
npm run build
```

#### 3.4 Ejecutar migraciones de base de datos

```bash
cd backend

# Ver cambios pendientes
npm run db:migrate -- --dry-run

# Ejecutar migraciones
npm run db:migrate

# Seed (opcional, para testing)
npm run db:seed
```

#### 3.5 Iniciar servicios

```bash
# Backend
cd backend
npm run dev  # o pm2 start npm -- run dev --name barber-api

# Frontend (en otra terminal o proceso)
cd frontend
npm run dev  # o pm2 start npm -- run dev --name barber-web
```

✅ **Status:** Staging environment ready

---

## 🧪 TESTING EN STAGING

### Paso 4: Validación completa en Staging

#### 4.1 Health Checks

```bash
# API Health
curl -X GET http://localhost:5000/health
# Esperado: {"success": true, "message": "Server is running"}

# Swagger UI
curl -X GET http://localhost:5000/api/docs
# Esperado: HTML de Swagger UI

# API Docs JSON
curl -X GET http://localhost:5000/api/docs.json
# Esperado: JSON specification
```

#### 4.2 Authentication Testing

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@staging.com",
    "password": "TestPassword123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@staging.com",
    "password": "TestPassword123"
  }'

# Get profile (requiere token JWT)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4.3 SMS Testing

```bash
# Crear reservación (genera SMS)
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "barberId": "barber-id",
    "serviceId": "service-id",
    "date": "2026-07-20T14:00:00Z",
    "clientPhone": "+1234567890"
  }'

# Verificar SMS enviado
# Ir a Twilio Console y verificar logs
```

#### 4.4 Payment Testing

```bash
# Crear payment intent (Stripe)
curl -X POST http://localhost:5000/api/payments/stripe/create-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reservationId": "reservation-id",
    "amount": 5000
  }'

# Usar tarjeta de test: 4242 4242 4242 4242
# Mes: 12/25, CVC: 123
```

#### 4.5 Reviews Testing

```bash
# Crear review
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reservationId": "reservation-id",
    "rating": 5,
    "comment": "Great service!"
  }'

# Listar reviews
curl -X GET http://localhost:5000/api/reviews/barber/barber-id
```

#### 4.6 Load Testing

```bash
# Instalar Apache Bench
apt-get install apache2-utils

# Test 100 requests, 10 concurrentes
ab -n 100 -c 10 http://localhost:5000/health
```

#### 4.7 Database Verification

```bash
# Conectar a base de datos
psql -U user -h staging-db -d barber_booking_staging

# Verificar tablas creadas
\dt

# Verificar Payment model
SELECT * FROM "Payment" LIMIT 1;

# Verificar Review model
SELECT * FROM "Review" LIMIT 1;

# Contar registros
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Reservation";
SELECT COUNT(*) FROM "Payment";
SELECT COUNT(*) FROM "Review";
```

#### 4.8 Run Complete Test Suite

```bash
cd backend
npm test

# Output esperado:
# PASS  src/__tests__/services/auth.service.test.ts
# PASS  src/__tests__/services/payment.service.test.ts
# PASS  src/__tests__/services/sms.service.test.ts
# PASS  src/__tests__/services/review.service.test.ts
# PASS  src/__tests__/utils/validation.test.ts

# Test Suites: 5 passed, 5 total
# Tests: 95 passed, 95 total
```

✅ **Status:** All tests passing in staging

---

## 🚀 DEPLOYMENT A PRODUCCIÓN

### Paso 5: Deploy a producción

#### 5.1 Pre-Production Verification

```bash
# Última verificación
git checkout main
git status  # Must be clean

npm run build
npm run type-check
npm test

# Verificar que estamos en v1.1.0
git tag | grep v1.1.0
```

#### 5.2 Production Environment Setup

```bash
# En servidor de producción:
cd /var/www/barber-booking-app

# Crear backup de versión anterior
git stash
cp -r . ../barber-booking-app-backup-v1.0.0

# Obtener versión 1.1.0
git fetch origin
git checkout v1.1.0
```

#### 5.3 Configurar variables de producción

```bash
# Copiar .env
cp backend/.env.example backend/.env

# Editar con credenciales PRODUCTION:
# - DATABASE_URL: producción
# - JWT_SECRET: nueva clave fuerte
# - TWILIO_*: credenciales producción
# - STRIPE_*: credenciales producción (no test)
# - PAYPAL_*: credenciales producción
# - FRONTEND_URL: https://barberbooking.app
# - NODE_ENV: production
# - LOG_LEVEL: info
```

#### 5.4 Database Migration

```bash
# CRÍTICO: Backup antes de migrar
pg_dump -h prod-db -U user -d barber_booking > backup_v1.0.0.sql

cd backend

# Ver cambios
npm run db:migrate -- --dry-run

# Ejecutar migraciones
npm run db:migrate

# Verificar
psql -h prod-db -U user -d barber_booking -c "SELECT COUNT(*) FROM \"Payment\";"
```

#### 5.5 Build & Deploy

```bash
# Backend
cd backend
npm install --production
npm run build

# Frontend
cd ../frontend
npm install --production
npm run build
```

#### 5.6 Start Services (usando PM2)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Backend
pm2 start "npm run start" --name barber-api --cwd /var/www/barber-booking-app/backend

# Frontend
pm2 start "npm start" --name barber-web --cwd /var/www/barber-booking-app/frontend

# Salvar configuración
pm2 save

# Setup para auto-start en reboot
pm2 startup
```

#### 5.7 Nginx Configuration

```nginx
# /etc/nginx/sites-available/barberbooking.app

upstream barber_api {
    server localhost:5000;
}

upstream barber_web {
    server localhost:3000;
}

server {
    listen 80;
    server_name barberbooking.app www.barberbooking.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name barberbooking.app www.barberbooking.app;

    ssl_certificate /etc/ssl/certs/barberbooking.crt;
    ssl_certificate_key /etc/ssl/private/barberbooking.key;

    # Frontend
    location / {
        proxy_pass http://barber_web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://barber_api;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Swagger UI
    location /api/docs {
        proxy_pass http://barber_api;
        proxy_set_header Host $host;
    }
}
```

Recargar nginx:
```bash
nginx -t
systemctl reload nginx
```

#### 5.8 SSL Certificate (Let's Encrypt)

```bash
# Instalar Certbot
apt-get install certbot python3-certbot-nginx

# Obtener certificado
certbot certonly --nginx -d barberbooking.app -d www.barberbooking.app

# Auto-renew
certbot renew --dry-run
```

✅ **Status:** Production deployment complete

---

## ✅ POST-DEPLOYMENT

### Paso 6: Verificación post-deployment

#### 6.1 Health Checks

```bash
# API
curl -X GET https://api.barberbooking.app/health
# Esperado: {"success": true, "message": "Server is running"}

# Web
curl -X GET https://barberbooking.app
# Esperado: HTML del sitio

# Swagger
curl -X GET https://api.barberbooking.app/api/docs
# Esperado: HTML de Swagger UI
```

#### 6.2 DNS Verification

```bash
# Verificar DNS
dig barberbooking.app
dig www.barberbooking.app

# Esperado: IP apuntando a servidor
```

#### 6.3 SSL Certificate Verification

```bash
# Verificar certificado
openssl s_client -connect api.barberbooking.app:443

# O en navegador: verificar candado en HTTPS
```

#### 6.4 Database Verification

```bash
# Conectar a base de datos de producción
psql -h prod-db -U user -d barber_booking

# Verificar modelos nuevos
SELECT COUNT(*) FROM "Payment";
SELECT COUNT(*) FROM "Review";

# Verificar índices
\d "Payment"
\d "Review"
```

#### 6.5 Monitoring Setup

```bash
# Setup PM2 Monitoring
pm2 web  # Accesible en http://localhost:9615

# Setup logs
pm2 logs barber-api
pm2 logs barber-web

# Setup alertas
pm2 install pm2-auto-pull
pm2 start app.js --watch
```

#### 6.6 Smoke Tests

```bash
# Test registro
curl -X POST https://api.barberbooking.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testprod@barberbooking.app",
    "password": "TestPassword123",
    "name": "Production Test"
  }'

# Test login
curl -X POST https://api.barberbooking.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testprod@barberbooking.app",
    "password": "TestPassword123"
  }'
```

✅ **Status:** All post-deployment checks passed

---

## ↩️ ROLLBACK PLAN

### Paso 7: Plan de rollback (si es necesario)

#### 7.1 Quick Rollback (últimos 5 minutos)

```bash
cd /var/www/barber-booking-app

# Detener servicios
pm2 stop barber-api barber-web

# Volver a v1.0.0
git checkout v1.0.0

# Rebuild
npm install --production
npm run build

# Reiniciar
pm2 start barber-api barber-web

# Verificar
curl -X GET https://api.barberbooking.app/health
```

#### 7.2 Database Rollback

```bash
# Si necesita rollback de BD:
# Usar backup creado antes de migración

psql -h prod-db -U user -d barber_booking < backup_v1.0.0.sql

# Verificar
SELECT COUNT(*) FROM "User";
```

#### 7.3 Notify Team

```bash
# Mensaje a Slack/Teams/Email:

🚨 ROLLBACK EXECUTED

Version: v1.0.0 (from v1.1.0)
Time: [timestamp]
Reason: [reason]
Status: ✅ Services online

Next steps:
- Investigate issue
- Create hotfix branch
- Test locally
- Deploy hotfix
```

---

## 📊 MONITORING

### Paso 8: Configurar monitoreo

#### 8.1 Application Monitoring

```bash
# PM2 Plus (optional, paid)
pm2 plus

# Local monitoring
pm2 monit

# Logs
pm2 logs barber-api --err
pm2 logs barber-web --err
```

#### 8.2 Server Monitoring

```bash
# Install New Relic (o similar)
npm install newrelic --save

# Configure newrelic.js
# Restart apps
pm2 restart all
```

#### 8.3 Database Monitoring

```bash
# PostgreSQL logs
tail -f /var/log/postgresql/postgresql.log

# Query slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

#### 8.4 Uptime Monitoring

```bash
# UptimeRobot o similar
# Setup alerts para:
# - https://barberbooking.app
# - https://api.barberbooking.app/health

# Verificar manual
watch -n 60 "curl -s -w '%{http_code}' -o /dev/null https://api.barberbooking.app/health"
```

#### 8.5 Error Tracking

```bash
# Sentry o similar
npm install @sentry/node

# En backend/src/server.ts:
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: "YOUR_SENTRY_DSN" });

# Restart
pm2 restart barber-api
```

#### 8.6 Performance Monitoring

```bash
# Google Analytics para frontend
# Datadog para backend
# New Relic APM
# CloudWatch para AWS

# Ver métricas críticas:
# - API response time
# - Database queries
# - Error rate
# - CPU/Memory usage
```

---

## 🎯 RESUMEN DE PASOS

```
✅ Pre-Deployment Checklist (Tests, Docs, Security)
  ↓
✅ GitHub Release Setup (Create v1.1.0 release)
  ↓
✅ Merge de Branches (5 merges en orden)
  ↓
✅ Staging Deployment (Setup, config, tests)
  ↓
✅ Staging Testing (Health, Auth, SMS, Payments, Reviews)
  ↓
✅ Production Deployment (Setup, migrate, build, start)
  ↓
✅ Post-Deployment Verification (Health checks, DNS, SSL)
  ↓
✅ Monitoring Setup (PM2, Sentry, Datadog)
  ↓
✅ v1.1.0 LIVE! 🚀
```

---

## 📞 EMERGENCY CONTACTS

Si algo sale mal:

- **API Down:** Check PM2 logs → `pm2 logs barber-api`
- **Database Error:** Check connection string in .env
- **SMS Not Sending:** Check Twilio credentials + logs
- **Payments Failing:** Check Stripe/PayPal webhook URLs
- **SSL Issues:** Check certificate expiration
- **High CPU:** Check database queries + optimize

---

## 📋 DEPLOYMENT CHECKLIST

```
Pre-Deployment:
☐ All tests passing
☐ Build successful
☐ Type checking passed
☐ Linting passed
☐ Credentials secured
☐ .env.example updated
☐ CHANGELOG updated
☐ Backups created

GitHub:
☐ Release v1.1.0 created
☐ All branches merged to main
☐ Tag v1.1.0 created

Staging:
☐ Code deployed
☐ Env variables configured
☐ Database migrated
☐ Services started
☐ Health checks passed
☐ All tests run
☐ SMS tested
☐ Payments tested
☐ Reviews tested

Production:
☐ Code deployed
☐ Env variables configured
☐ Database backed up + migrated
☐ Services started
☐ Health checks passed
☐ DNS verified
☐ SSL working
☐ Monitoring enabled
☐ Team notified

Post-Deployment:
☐ Smoke tests passed
☐ Real users testing
☐ Monitor metrics
☐ Ready to support
```

---

**Documento:** DEPLOYMENT_GUIDE_v1.1.0.md  
**Versión:** 1.1.0  
**Status:** ✅ READY TO DEPLOY  
**Next Step:** Start merging branches!

¡Buena suerte con el deployment! 🚀
