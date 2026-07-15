# Barber Booking App - Frontend

## Estructura del Proyecto

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── admin/
│   │   ├── calendar/
│   │   ├── reservations/
│   │   ├── barbers/
│   │   ├── services/
│   │   ├── clients/
│   │   ├── reports/
│   │   └── page.tsx
│   ├── booking/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── providers/
│   ├── sections/
│   ├── admin/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── BookingForm.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useBooking.ts
│   └── useAdmin.ts
├── lib/
│   ├── api-client.ts
│   ├── schemas/
│   └── types.ts
└── public/
```

## Stack Tecnológico

- **Next.js 14** - React Framework
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **React Hook Form** - Manejo de formularios
- **Zod** - Validaciones
- **TanStack Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP

## Instalación

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Variables de Entorno

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea la versión de producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run type-check` - Verifica tipos de TypeScript

## Páginas

### Públicas
- `/` - Página de inicio
- `/booking` - Reservar cita
- `/auth/login` - Iniciar sesión
- `/auth/register` - Crear cuenta

### Admin
- `/admin` - Dashboard
- `/admin/calendar` - Calendario de citas
- `/admin/reservations` - Gestión de reservas
- `/admin/barbers` - Gestión de barberos
- `/admin/services` - Gestión de servicios
- `/admin/clients` - Gestión de clientes
- `/admin/reports` - Reportes

## Componentes Principales

### Navbar
Barra de navegación con tema oscuro/claro

### HeroSection
Sección principal con animaciones

### ServicesSection
Listado de servicios disponibles

### BookingForm
Formulario para reservar citas

### DashboardStats
Tarjetas de estadísticas del admin

## Temas

El proyecto soporta tema oscuro y claro con `next-themes`.

## Deployment

Ver `../docs/DEPLOYMENT.md`
