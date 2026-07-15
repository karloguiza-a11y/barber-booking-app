# Barber Booking App - Documentación Completa

## 📋 Descripción General

Aplicación web de reserva de citas para barberías con:
- Sistema de autenticación de usuarios
- Reserva online de citas
- Panel de administración
- Gestión de barberos, servicios y clientes
- Notificaciones por email
- Imágenes de referencia
- Dashboard con estadísticas

## 🏗️ Arquitectura del Proyecto

```
barber-booking-app/
├── backend/          # API REST con Express.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── utils/
│   │   ├── types/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/         # Next.js 14 App
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── public/
    ├── package.json
    └── tsconfig.json
```

## 🛠️ Stack Tecnológico

### Backend
- **Node.js + Express.js** - Servidor web
- **TypeScript** - Tipado estático
- **Prisma ORM** - Gestión de base de datos
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Zod** - Validaciones
- **Nodemailer** - Envío de emails
- **Cloudinary** - Almacenamiento de imágenes
- **Express Rate Limiter** - Limitación de requests
- **Helmet** - Seguridad HTTP
- **CORS** - Control de acceso

### Frontend
- **Next.js 14** - React Framework
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **React Hook Form** - Formularios
- **Zod** - Validaciones
- **TanStack Query** - Manejo de datos del servidor
- **Axios** - Cliente HTTP
- **FullCalendar** - Calendario interactivo

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js >= 18
- PostgreSQL >= 12
- npm o yarn

### Instalación Backend

```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env

# Configurar variables de entorno
# DATABASE_URL=postgresql://user:password@localhost:5432/barber_db
# JWT_SECRET=tu_secreto_aqui
# etc...

# Ejecutar migraciones
npx prisma migrate dev

# Seed de datos (opcional)
npx prisma db seed

# Iniciar servidor
npm run dev
```

### Instalación Frontend

```bash
cd frontend
npm install

# Crear archivo .env.local
cp .env.example .env.local

# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Iniciar servidor de desarrollo
npm run dev
```

Accede a `http://localhost:3000`

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener datos del usuario (requiere token)

### Servicios
- `GET /api/services` - Listar servicios
- `GET /api/services/:id` - Obtener servicio
- `POST /api/services` - Crear servicio (admin)
- `PATCH /api/services/:id` - Actualizar servicio (admin)
- `DELETE /api/services/:id` - Eliminar servicio (admin)

### Barberos
- `GET /api/barbers` - Listar barberos
- `GET /api/barbers/:id` - Obtener barbero
- `POST /api/barbers` - Crear barbero (admin)
- `PATCH /api/barbers/:id` - Actualizar barbero (admin)
- `DELETE /api/barbers/:id` - Eliminar barbero (admin)

### Reservaciones
- `POST /api/reservations` - Crear reservación
- `GET /api/reservations/:id` - Obtener reservación
- `GET /api/reservations/my-reservations` - Mis reservaciones
- `PATCH /api/reservations/:id` - Actualizar reservación
- `DELETE /api/reservations/:id` - Cancelar reservación

### Admin
- `GET /api/admin/stats` - Estadísticas del dashboard
- `GET /api/admin/calendar` - Citas para calendario
- `GET /api/admin/clients` - Listar clientes
- `GET /api/admin/clients/:id` - Detalles del cliente

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (12 salts)
- ✅ JWT para autenticación
- ✅ Rate limiting en endpoints de autenticación
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad
- ✅ Validación de datos con Zod
- ✅ SQL injection protección (Prisma ORM)
- ✅ XSS protección (Next.js + escaping)

## 📧 Notificaciones por Email

El sistema envía emails automáticos para:
- ✅ Confirmación de reservación
- ✅ Cancelación de reservación
- ✅ Recordatorio 24 horas antes
- ✅ Confirmación de completitud

## 🖼️ Gestión de Imágenes

- Integración con Cloudinary
- Subida de imágenes de referencia en reservaciones
- Límite de 20MB por imagen
- Formatos soportados: JPG, PNG, WEBP

## 📊 Base de Datos

### Modelo Entidad-Relación

```
User ─────┬─── Client
          ├─── Barber ─── BarberService ─── Service
          │           └── BarberSchedule
          └─── Admin

Reservation ─── Client
            ├── Barber
            ├── Service
            ├── ReferenceImage
            ├── Notification
            └── Payment
```

## 🎨 Temas y Estilos

- **Dark Mode por defecto**
- **Light Mode disponible**
- **Color primario**: Dorado (#C9A227)
- **Responsive design** - Mobile first
- **Animaciones suaves** con Framer Motion

## 👥 Roles de Usuario

1. **CLIENT** - Usuario regular
   - Crear reservaciones
   - Ver sus citas
   - Cancelar citas
   - Ver servicios

2. **BARBER** - Barbero
   - Ver sus citas programadas
   - Actualizar estado de citas
   - Gestionar disponibilidad

3. **ADMIN** - Administrador
   - Acceso total al dashboard
   - Gestionar barberos
   - Gestionar servicios
   - Ver reportes
   - Gestionar clientes

## 📱 Responsividad

- ✅ Mobile first design
- ✅ Tablets (768px+)
- ✅ Desktop (1024px+)
- ✅ Large screens (1280px+)

## 🧪 Testing

*Por implementar en próxima fase*

## 📦 Deployment

### Backend (Heroku/Railway/Vercel)
```bash
cd backend
npm run build
node dist/server.js
```

### Frontend (Vercel)
```bash
cd frontend
npm run build
npm start
```

Ver `DEPLOYMENT.md` para más detalles.

## 🐛 Troubleshooting

### Error de conexión a base de datos
```bash
# Verificar que PostgreSQL está corriendo
# Verificar conexión
psql -U user -d database_name -c "SELECT 1"
```

### Error CORS
```bash
# Verificar que FRONTEND_URL en .env del backend es correcto
# FRONTEND_URL=http://localhost:3000
```

### Error de token
```bash
# Verificar que JWT_SECRET está configurado
# Limpiar localStorage en el navegador
```

## 📝 Licencia

MIT

## 👨‍💼 Autor

Karlo Guiza

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request
