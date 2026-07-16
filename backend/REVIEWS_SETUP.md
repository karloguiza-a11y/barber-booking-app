# Sistema de Reseñas y Calificaciones - Guía de Implementación

## 📋 Descripción General

El sistema de reseñas y calificaciones permite que los clientes dejen comentarios verificados sobre los servicios de los barberos. Las reseñas ayudan a otros clientes a tomar decisiones informadas y a los barberos a mejorar sus servicios.

## ✨ Características Principales

- **Reseñas Verificadas**: Solo clientes que completaron la reserva pueden dejar reseña
- **Calificación de 1-5 Estrellas**: Sistema simple e intuitivo
- **Comentarios y Imágenes**: Posibilidad de agregar descripción e imágenes (hasta 5)
- **Útil/No Útil**: Los usuarios pueden marcar reseñas como útiles o no
- **Reportes de Contenido Inapropiado**: Sistema de moderación para comentarios
- **Ratings por Barbero y Servicio**: Cálculos automáticos y eficientes
- **Gestión Admin**: Los administradores pueden eliminar reseñas inapropiadas

## 🔧 Configuración

### Base de Datos

La migración agrega el modelo `Review` con las siguientes características:

```prisma
model Review {
  id              String   @id @default(cuid())
  
  reservation     Reservation @relation(fields: [reservationId], references: [id])
  reservationId   String   @unique
  
  barber          Barber   @relation(fields: [barberId], references: [id])
  barberId        String
  
  client          Client   @relation(fields: [clientId], references: [id])
  clientId        String
  
  rating          Int      // 1-5 stars
  title           String?
  comment         String?  @db.Text
  
  images          String[] // URLs de imágenes
  
  helpful         Int      @default(0)
  unhelpful       Int      @default(0)
  
  isVerified      Boolean  @default(false)
  isDeleted       Boolean  @default(false)
  reportReason    String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Ejecutar Migración

```bash
# En el directorio backend
npm run prisma:migrate

# O manualmente:
npx prisma migrate dev --name add_review_model
```

## 📚 Endpoints API

### Crear Reseña

```http
POST /api/reviews
Content-Type: application/json
Authorization: Bearer {token}

{
  "reservationId": "reservation-123",
  "rating": 5,
  "title": "Excelente corte de cabello",
  "comment": "El barbero fue muy profesional y amable. Muy recomendado.",
  "images": [
    "https://cloudinary.com/image1.jpg"
  ]
}
```

**Respuesta (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "review-123",
    "reservationId": "reservation-123",
    "barberId": "barber-123",
    "clientId": "client-123",
    "rating": 5,
    "title": "Excelente corte de cabello",
    "comment": "El barbero fue muy profesional y amable. Muy recomendado.",
    "images": ["https://cloudinary.com/image1.jpg"],
    "helpful": 0,
    "unhelpful": 0,
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Actualizar Reseña

```http
PATCH /api/reviews/{reviewId}
Content-Type: application/json
Authorization: Bearer {token}

{
  "rating": 4,
  "comment": "Muy bueno, solo uno pequeños detalles."
}
```

### Obtener Reseñas de un Barbero

```http
GET /api/reviews/barber/{barberId}?page=1&limit=10&sortBy=recent
Authorization: Bearer {token}
```

**Parámetros Query:**
- `page` (default: 1): Número de página
- `limit` (default: 10): Reseñas por página
- `sortBy` (default: "recent"): "recent" | "helpful" | "rating"

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "id": "review-1",
      "rating": 5,
      "title": "Excelente",
      "comment": "Muy bueno",
      "isVerified": true,
      "helpful": 12,
      "unhelpful": 1,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
```

### Obtener Rating de un Barbero

```http
GET /api/barber/{barberId}/rating
Authorization: Bearer {token}
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "barberId": "barber-123",
    "average": 4.7,
    "total": 45,
    "distribution": {
      "1": 2,
      "2": 1,
      "3": 5,
      "4": 12,
      "5": 25
    }
  }
}
```

### Marcar como Útil

```http
POST /api/reviews/{reviewId}/helpful
Authorization: Bearer {token}
```

### Reportar Reseña Inapropiada

```http
POST /api/reviews/{reviewId}/report
Content-Type: application/json
Authorization: Bearer {token}

{
  "reason": "Lenguaje ofensivo e inapropiado"
}
```

### Obtener Reseñas Reportadas (Admin)

```http
GET /api/reviews/reported?page=1&limit=20
Authorization: Bearer {admin-token}
```

### Eliminar Reseña Reportada (Admin)

```http
DELETE /api/reviews/{reviewId}/reported
Authorization: Bearer {admin-token}
```

## ✅ Validaciones

### Rating

- **Requerido**: Sí
- **Tipo**: Entero
- **Rango**: 1-5
- **Error**: `Rating must be between 1 and 5`

### Título

- **Requerido**: No
- **Tipo**: String
- **Máximo**: 200 caracteres
- **Error**: `Title must not exceed 200 characters`

### Comentario

- **Requerido**: No
- **Tipo**: String (Text)
- **Máximo**: 1000 caracteres
- **Error**: `Comment must not exceed 1000 characters`

### Imágenes

- **Requerido**: No
- **Tipo**: Array de URLs
- **Máximo**: 5 imágenes
- **Formatos válidos**: jpg, jpeg, png, gif, webp
- **Errores**:
  - `Maximum 5 images allowed per review`
  - `Image must be a valid URL`
  - `Image must be a valid image format`

### Reglas de Negocio

1. **Verificación de Reserva**: Solo se puede crear reseña para reservas completadas
2. **Una Reseña por Reserva**: No puede haber dos reseñas para la misma reserva
3. **Una por Usuario**: Un usuario solo puede dejar una reseña por reserva
4. **Soft Delete**: Las reseñas no se eliminan, se marcan como eliminadas
5. **Permisos**: Solo el creador puede actualizar o eliminar su propia reseña

## 📊 Cálculo de Ratings

### Rating Promedio del Barbero

El rating promedio se calcula considerando todas las reseñas no eliminadas del barbero:

```
average = sum(all_ratings) / count(all_ratings)
```

El promedio se redondea a un decimal:

```
average = round(average * 10) / 10
```

**Ejemplos:**
- 5 estrellas: [5, 4, 5, 3, 5] = 22/5 = 4.4
- Sin reseñas: average = 0

### Distribución de Ratings

Se calcula cuántas reseñas hay para cada nivel de stars (1-5):

```json
{
  "1": 2,  // 2 reseñas de 1 estrella
  "2": 1,  // 1 reseña de 2 estrellas
  "3": 5,  // 5 reseñas de 3 estrellas
  "4": 12, // 12 reseñas de 4 estrellas
  "5": 25  // 25 reseñas de 5 estrellas
}
```

## 🔐 Seguridad y Permisos

### Crear Reseña
- ✅ Cliente autenticado
- ✅ Solo para reservas propias
- ✅ Solo para reservas completadas

### Actualizar Reseña
- ✅ Cliente autenticado
- ✅ Solo el creador de la reseña

### Eliminar Reseña
- ✅ Cliente autenticado (soft delete)
- ✅ Solo el creador

### Ver Reseñas
- ✅ Cualquier usuario autenticado

### Reportar Reseña
- ✅ Cualquier usuario autenticado

### Eliminar Reseña Reportada
- ✅ Solo administrador

## 📝 Ejemplos de Uso

### Flujo Completo

1. **Cliente reserva cita**
   ```http
   POST /api/reservations
   ```

2. **Barbero marca cita como completada** (Después del horario)
   ```http
   PATCH /api/reservations/{id}
   { "status": "COMPLETED" }
   ```

3. **Cliente deja reseña** (Puede hacerlo inmediatamente después)
   ```http
   POST /api/reviews
   {
     "reservationId": "...",
     "rating": 5,
     "title": "Excelente!",
     "comment": "Muy buen servicio"
   }
   ```

4. **Otros clientes ven la reseña y rating del barbero**
   ```http
   GET /api/reviews/barber/{barberId}
   GET /api/barber/{barberId}
   ```

5. **Si hay contenido inapropiado, se reporta**
   ```http
   POST /api/reviews/{reviewId}/report
   { "reason": "Contenido inapropiado" }
   ```

6. **Admin revisa y elimina si es necesario**
   ```http
   GET /api/reviews/reported
   DELETE /api/reviews/{reviewId}/reported
   ```

## 🧪 Testing

Se incluyen 26 test cases cubriendo:

- Validación de entrada (rating, título, comentario, imágenes)
- Verificación de permisos
- Cálculo de ratings promedio
- Distribución de ratings
- Creación, actualización y eliminación
- Paginación
- Reportes y moderación

Ejecutar tests:

```bash
npm run test -- review.service.test.ts
```

## 🚀 Rendimiento

### Índices de Base de Datos

Se crean índices en:
- `reservationId` (unique)
- `barberId`
- `clientId`
- `isDeleted`
- `reportReason`

Esto asegura consultas eficientes.

### Cálculo de Ratings en Caché

El rating promedio del barbero se recalcula y actualiza en la tabla `barber` después de cada:
- Crear review
- Actualizar review
- Eliminar review (soft delete)

Esto evita cálculos costosos en cada lectura.

## 📱 Integración Frontend

### Componente de Reseña

```typescript
interface ReviewData {
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}

function createReview(reservationId: string, data: ReviewData) {
  return fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      reservationId,
      ...data
    })
  })
}
```

### Mostrar Rating en Perfil de Barbero

```typescript
async function getBarberProfile(barberId: string) {
  const response = await fetch(`/api/barber/${barberId}`);
  const data = await response.json();
  
  return {
    name: data.data.firstName,
    rating: data.data.averageRating, // Ej: 4.7
    reviewCount: data.data.reviewCount, // Ej: 45
    ratingDistribution: data.data.ratingDistribution
  }
}
```

## 🔄 Migraciones Futuras

Posibles mejoras:

1. **Reseñas de Imágenes**: Crop/redimensionamiento automático
2. **AI Moderation**: Detección automática de contenido inapropiado
3. **Respuestas del Barbero**: Los barberos pueden responder reseñas
4. **Filtros Avanzados**: Filtrar por fecha, rango de rating, etc.
5. **Reviews Certificadas**: Badge de "Cliente Verificado"
6. **Importancia de Reseñas**: Weighting basado en `helpful` votes

## ❓ Preguntas Frecuentes

**P: ¿Cuándo puedo dejar una reseña?**
R: Puedes dejar una reseña después de que tu cita esté marcada como completada. No hay límite de tiempo, pero se recomienda hacerlo pronto mientras la experiencia esté fresca.

**P: ¿Puedo editar mi reseña?**
R: Sí, puedes editar cualquier aspecto de tu reseña (rating, comentario, imágenes) en cualquier momento.

**P: ¿Puedo eliminar mi reseña?**
R: Sí, puedes eliminar tu reseña en cualquier momento. Se marca como eliminada pero se conserva en la base de datos para auditoría.

**P: ¿Qué pasa si reporto una reseña?**
R: Un administrador revisará el reporte. Si el contenido es efectivamente inapropiado, se eliminará.

**P: ¿Cómo se calcula el rating del barbero?**
R: Se calcula el promedio de todas las reseñas no eliminadas, redondeado a un decimal.

---

**Última actualización**: 2024-01-15
**Versión**: 1.0.0
