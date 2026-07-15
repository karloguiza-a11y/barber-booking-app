# Backend - Barber Booking API

## Descripción

API REST para gestión de reservas de barbería construida con Express.js, TypeScript y PostgreSQL.

## Estructura del Proyecto

```
src/
├── config/          # Configuraciones (env, email, cloudinary)
├── controllers/     # Controladores de rutas
├── middleware/      # Middleware (auth, error, rate limit)
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── schemas/         # Esquemas de validación
├── types/           # Tipos TypeScript
├── utils/           # Utilidades (helpers, errores)
└── server.ts        # Entrada principal

prisma/
├── schema.prisma    # Esquema de base de datos
└── seed.ts          # Script para popular datos
```

## Instalación

```bash
npm install
cp .env.example .env
# Editar .env con tus valores
npx prisma migrate dev
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Inicia en modo desarrollo (hot reload)
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Ejecuta versión de producción compilada
- `npm run lint` - Ejecuta ESLint
- `npm run type-check` - Verifica tipos de TypeScript
- `npm run db:migrate` - Ejecuta migraciones Prisma
- `npm run db:seed` - Ejecuta seed script
- `npm run db:studio` - Abre Prisma Studio

## Variables de Entorno

Ver `.env.example` para referencia completa.

**Requeridas:**
- `DATABASE_URL` - URL de conexión a PostgreSQL
- `JWT_SECRET` - Secreto para firmar JWTs
- `GMAIL_USER` - Email de Gmail
- `GMAIL_APP_PASSWORD` - Password de app de Google
- `CLOUDINARY_CLOUD_NAME` - Cloud name de Cloudinary
- `CLOUDINARY_API_KEY` - API key de Cloudinary
- `CLOUDINARY_API_SECRET` - API secret de Cloudinary

## Base de Datos

### Migraciones

```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Ver estado
npx prisma migrate status

# Deploy a producción
npx prisma migrate deploy
```

### Seed

```bash
npm run db:seed
```

Crea:
- 4 servicios
- 1 usuario admin
- 2 barberos con horarios
- Relaciones entre servicios y barberos

## API Endpoints

Ver documentación en `/docs` o consulta los comentarios en las rutas.

## Autenticación

Utiliza JWT tokens en el header `Authorization: Bearer {token}`

## Errores

Los errores se retornan con estructura:

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## Seguridad

- ✅ Contraseñas hasheadas con bcrypt (12 salts)
- ✅ JWT para autenticación
- ✅ Rate limiting en auth
- ✅ CORS configurado
- ✅ Helmet para headers
- ✅ Validaciones en servidor
- ✅ SQL injection protection (Prisma)

## Performance

- Índices en campos de búsqueda frecuente
- Caché implícito con QueryClient
- Paginación en listados
- Lazy loading de relaciones

## Deployment

Ver `DEPLOYMENT.md` en la raíz del proyecto.
