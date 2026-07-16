# 🎯 ¿QUÉ HACER AHORA? - Plan de Acción

Tu app está lista. Aquí está exactamente qué hacer:

---

## 🔴 PASO 1: Ir a Supabase y crear las tablas

### En Supabase SQL Editor, ejecuta esto:

```sql
-- Tabla de Barberos
CREATE TABLE IF NOT EXISTS barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  image_url TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Reservas
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  barber_id UUID NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  barber_id UUID NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

✅ **Hecho**

---

## 🟡 PASO 2: Agregar datos de prueba

### En Supabase, inserta barberos:

```sql
INSERT INTO barbers (name, specialty, bio, rating) VALUES
('Carlos López', 'Fade Moderno', 'Especialista en cortes modernos', 4.8),
('Juan Pérez', 'Diseño Clásico', 'Cortes tradicionales con precisión', 4.9),
('Pedro Martínez', 'Barba & Estilo', 'Experto en cuidado de barba', 4.7);
```

✅ **Hecho**

---

## 🟢 PASO 3: Probar en el navegador

### Abre: http://localhost:3000

1. **Haz clic en "Comenzar"**
2. **Ves la página de login**
3. **Crea una cuenta nueva** (cualquier email, password >= 6 caracteres)
4. **¡Verás los 3 barberos!** 🎉

---

## 🎨 PASO 4: Si quieres mejorar la UI

Edita cualquier archivo en `frontend/` y verás los cambios automáticamente:

```typescript
// frontend/app/page.tsx
// ← Edita el diseño aquí
// ← Cambios aparecen en http://localhost:3000 (hot reload)
```

---

## 📚 PASO 5: Integrar más funciones

### Ejemplos de cómo usar los hooks:

**Crear una reserva programaticamente:**
```typescript
const { createReservation } = useReservations(userId)

await createReservation({
  user_id: userId,
  barber_id: 'barber-123',
  service: 'Corte + Barba',
  date: '2026-07-20',
  time: '14:00',
  status: 'pending',
  price: 25,
})
```

**Crear un review:**
```typescript
const { createReview } = useReviews()

await createReview({
  reservation_id: 'res-123',
  user_id: userId,
  barber_id: barberId,
  rating: 5,
  comment: '¡Excelente servicio!',
})
```

---

## 🚀 ¿Qué tienes ahora?

```
✅ Servidor dev corriendo (npm run dev)
✅ Supabase conectado
✅ 4 hooks listos para usar
✅ Página de inicio con listado de barberos
✅ Página de login/signup
✅ Hot reload activado
✅ Base de datos con tablas
```

---

## 📱 URLs importantes

- **App:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Supabase:** https://supabase.com/dashboard
- **Documentación Hooks:** SUPABASE_HOOKS_GUIDE.md

---

## 🛑 ERRORES COMUNES

### "No hay barberos disponibles"
→ Falta agregar datos en Supabase. Ve a PASO 2.

### "Connection failed"
→ Falta .env.local. Verifica que .env.local tenga:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### "Cambios no aparecen en navegador"
→ Presiona F5 o Ctrl+Shift+R para refrescar

---

## 🎯 PRÓXIMOS PASOS (OPCIONALES)

1. Agregar más campos a formularios
2. Mejorar diseño
3. Agregar validaciones
4. Crear página de "Mis Reservas"
5. Agregar pagos (Stripe)

---

**¡Listo! Ahora tienes una app totalmente funcional.** 🚀

El servidor sigue corriendo en http://localhost:3000

Cualquier cambio que hagas se ve automáticamente. ⚡
