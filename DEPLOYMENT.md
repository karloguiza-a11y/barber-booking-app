# Deployment Guide - Barber Booking App

## 🚀 Deployment Backend

### Opción 1: Railway.app (Recomendado)

1. **Crear cuenta en railway.app**

2. **Conectar repositorio**
   - Autorizar acceso a GitHub
   - Seleccionar repositorio

3. **Configurar variables de entorno**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=tu_secreto_fuerte_aqui
   GMAIL_USER=tu_email@gmail.com
   GMAIL_APP_PASSWORD=contraseña_app_google
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```

4. **Deploy automático**
   - Railway detecta package.json
   - Instala dependencias
   - Ejecuta prisma migrate
   - Inicia servidor

### Opción 2: Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Crear app
heroku create barber-booking-api

# Añadir PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configurar variables
heroku config:set JWT_SECRET="tu_secreto"
heroku config:set GMAIL_USER="tu_email@gmail.com"
# ... resto de variables

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

### Opción 3: Docker + cualquier host

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
COPY src ./src/
COPY tsconfig.json ./

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

```bash
docker build -t barber-api .
docker run -e DATABASE_URL="..." -p 5000:5000 barber-api
```

## 🌐 Deployment Frontend

### Vercel (Recomendado)

1. **Push a GitHub**
   ```bash
   git push origin main
   ```

2. **Conectar a Vercel**
   - Ir a vercel.com
   - Autorizar GitHub
   - Seleccionar repositorio
   - Seleccionar carpeta `frontend`

3. **Configurar variables de entorno**
   ```
   NEXT_PUBLIC_API_URL=https://tu-api.railway.app/api
   ```

4. **Deploy automático**
   - Vercel detecta cambios en main
   - Ejecuta `npm run build`
   - Deploy automático

### Netlify

```bash
npm run build
# Seleccionar carpeta 'out' como publish
```

### GitHub Pages

```bash
npm run build
git add out/
git commit -m "Deploy to GitHub Pages"
git push
```

## 🗄️ Base de Datos

### Railway PostgreSQL

- Railway crea automáticamente PostgreSQL
- Usa la URL de conexión en `DATABASE_URL`

### AWS RDS

```bash
# Crear instancia RDS
# Copiar endpoint
# Configurar URL
DATABASE_URL="postgresql://user:password@endpoint:5432/barber_db"

# Ejecutar migraciones
npx prisma migrate deploy
```

## 📧 Configurar Gmail

1. **Habilitar 2FA en Google Account**
2. **Generar App Password**
   - Ir a myaccount.google.com
   - Security → App passwords
   - Seleccionar Mail y Windows PC
   - Copiar password
3. **Usar en variables**
   ```
   GMAIL_USER=tu_email@gmail.com
   GMAIL_APP_PASSWORD=contraseña_generada
   ```

## 🖼️ Configurar Cloudinary

1. **Crear cuenta en cloudinary.com**
2. **Obtener credenciales**
   - Ir a Dashboard
   - Copiar Cloud Name, API Key, API Secret
3. **Configurar variables**
   ```
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

## 🔒 SSL/HTTPS

- **Vercel**: Automático
- **Railway**: Automático
- **Heroku**: Automático con dominio personalizado
- **Docker**: Usar Let's Encrypt con Nginx

## 🌍 Dominio Personalizado

### Vercel
1. Settings → Domains
2. Añadir dominio
3. Actualizar DNS records

### Railway
1. Settings → Domain
2. Conectar dominio
3. Actualizar DNS

## 📊 Monitoreo

### Logs
- **Railway**: Dashboard automático
- **Vercel**: Deployments → Functions
- **Heroku**: `heroku logs --tail`

### Errores
- Configurar Sentry.io
- Configurar LogRocket
- Configurar DataDog

## 🚨 Backup

```bash
# Backup PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# Restaurar
psql $DATABASE_URL < backup.sql
```

## ✅ Checklist Pre-Deployment

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Seed de datos ejecutado
- [ ] API testeable
- [ ] Frontend variables configuradas
- [ ] Build local exitoso
- [ ] CORS configurado correctamente
- [ ] SSL/HTTPS habilitado
- [ ] Backups configurados
- [ ] Monitoreo activo

## 🆘 Troubleshooting

### Error: DATABASE_URL not set
```bash
# Asegurar que la variable está en el host
echo $DATABASE_URL
```

### Error: JWT_SECRET not set
```bash
# Generar secreto fuerte
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Error: CORS issues
```bash
# Verificar FRONTEND_URL
# Debe ser exacta sin trailing slash
```

### Migraciones no corren
```bash
# Conectar a servidor y ejecutar
heroku run "npx prisma migrate deploy"
```
