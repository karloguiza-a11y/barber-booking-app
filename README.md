# Barber Booking App 💈

Aplicación web profesional para reserva de citas en barbería premium.

## Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React moderno
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Framer Motion** - Animaciones suaves
- **React Hook Form** - Manejo de formularios
- **Zod** - Validaciones
- **TanStack Query** - Gestión de estado del servidor
- **FullCalendar** - Calendario interactivo

### Backend
- **Node.js + Express** - Servidor API REST
- **Prisma ORM** - Gestión de base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Multer** - Carga de archivos
- **Zod** - Validaciones

### Infraestructura
- **Vercel** - Hosting frontend
- **Railway/Render** - Hosting backend
- **Cloudinary** - Almacenamiento de imágenes
- **Gmail SMTP** - Notificaciones por email

## Características

### Cliente
- ✅ Landing page premium
- ✅ Sistema de reservas inteligente
- ✅ Carga de imágenes de referencia
- ✅ Confirmación de citas
- ✅ Notificaciones por email
- ✅ Diseño responsive
- ✅ Modo oscuro/claro

### Admin
- ✅ Dashboard con estadísticas
- ✅ Calendario tipo Google Calendar
- ✅ Gestión de barberos
- ✅ Gestión de servicios
- ✅ Gestión de clientes
- ✅ Exportar a PDF/Excel
- ✅ Panel completamente responsive

## Instalación Rápida

```bash
# Backend
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Documentación

- [API REST](./docs/API.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [Base de Datos](./docs/DATABASE.md)

## Autor

karloguiza-a11y
