# 🎉 Supabase Conectado - Hooks Listos para Usar

Tu frontend ya está conectado a Supabase. Aquí están todos los hooks listos:

---

## 📍 Archivos Creados

```
frontend/
├── lib/
│   └── supabase.ts           ← Cliente de Supabase
├── hooks/
│   ├── useAuth.ts            ← Autenticación (login, signup, logout)
│   ├── useBarbers.ts         ← Obtener barberos
│   ├── useReservations.ts    ← Reservas (crear, actualizar, cancelar)
│   └── useReviews.ts         ← Reviews y ratings
```

---

## 🔐 Hook: useAuth

**Para autenticación**

```typescript
import { useAuth } from '@/hooks/useAuth'

export function MyComponent() {
  const { user, loading, error, login, signup, logout, isAuthenticated } = useAuth()

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123')
      // ✅ Usuario autenticado
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  if (loading) return <div>Loading...</div>

  if (isAuthenticated) {
    return (
      <div>
        <p>Hola, {user?.email}</p>
        <button onClick={logout}>Logout</button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
```

---

## 💇 Hook: useBarbers

**Para obtener lista de barberos**

```typescript
import { useBarbers } from '@/hooks/useBarbers'

export function BarbersList() {
  const { barbers, loading, error } = useBarbers()

  if (loading) return <div>Cargando barberos...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {barbers.map((barber) => (
        <div key={barber.id} className="border p-4 rounded">
          <h3>{barber.name}</h3>
          <p>Especialidad: {barber.specialty}</p>
          <p>Rating: ⭐ {barber.rating}</p>
          <button onClick={() => bookBarber(barber.id)}>Reservar</button>
        </div>
      ))}
    </div>
  )
}
```

---

## 📅 Hook: useReservations

**Para manejar reservas**

```typescript
import { useReservations, Reservation } from '@/hooks/useReservations'
import { useAuth } from '@/hooks/useAuth'

export function MyReservations() {
  const { user } = useAuth()
  const { reservations, loading, createReservation, cancelReservation } = 
    useReservations(user?.id)

  const handleNewReservation = async () => {
    try {
      const reservation = await createReservation({
        user_id: user!.id,
        barber_id: 'barber-123',
        service: 'Corte + Barba',
        date: '2026-07-20',
        time: '14:00',
        status: 'pending',
        price: 25,
      })
      console.log('✅ Reserva creada:', reservation)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleCancel = async (reservationId: string) => {
    try {
      await cancelReservation(reservationId)
      console.log('✅ Reserva cancelada')
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div>
      <button onClick={handleNewReservation}>Nueva Reserva</button>
      
      <div className="mt-6">
        <h2>Mis Reservas</h2>
        {reservations.map((res) => (
          <div key={res.id} className="border p-4 rounded mb-4">
            <p>Servicio: {res.service}</p>
            <p>Fecha: {res.date} - {res.time}</p>
            <p>Status: {res.status}</p>
            <button onClick={() => handleCancel(res.id)}>Cancelar</button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## ⭐ Hook: useReviews

**Para reviews y ratings**

```typescript
import { useReviews } from '@/hooks/useReviews'

export function BarberReviews({ barberId }: { barberId: string }) {
  const { reviews, loading, createReview, getBarberRating } = useReviews(barberId)

  const handleCreateReview = async () => {
    try {
      await createReview({
        reservation_id: 'res-123',
        user_id: 'user-456',
        barber_id: barberId,
        rating: 5,
        comment: '¡Excelente servicio!',
      })
      console.log('✅ Review creado')
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const avgRating = getBarberRating(barberId)

  return (
    <div>
      <h2>Rating Promedio: ⭐ {avgRating}</h2>
      
      <button onClick={handleCreateReview}>Agregar Review</button>

      <div className="mt-6">
        <h3>Comentarios ({reviews.length})</h3>
        {reviews.map((review) => (
          <div key={review.id} className="border p-4 rounded mb-4">
            <p>⭐ {review.rating}/5</p>
            <p>{review.comment}</p>
            <p className="text-sm text-gray-500">{review.created_at}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🎯 Ejemplo Completo: Página de Barberos

```typescript
'use client'

import { useBarbers } from '@/hooks/useBarbers'
import { useAuth } from '@/hooks/useAuth'
import { useReviews } from '@/hooks/useReviews'

export default function BarbersPage() {
  const { barbers, loading: loadingBarbers } = useBarbers()
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Elige tu Barbero</h1>

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-8">
          <p>Necesitas estar autenticado para hacer reservas.</p>
        </div>
      )}

      {loadingBarbers ? (
        <div className="text-center py-8">Cargando barberos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {barbers.map((barber) => (
            <BarberCard 
              key={barber.id} 
              barber={barber} 
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BarberCard({ barber, isAuthenticated }) {
  const { reviews } = useReviews(barber.id)
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A'

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
      {barber.image_url && (
        <img src={barber.image_url} alt={barber.name} className="w-full h-48 object-cover" />
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{barber.name}</h3>
        <p className="text-gray-600 mb-2">Especialidad: {barber.specialty}</p>
        <p className="text-lg font-bold text-yellow-500 mb-4">⭐ {avgRating}</p>
        
        <button
          disabled={!isAuthenticated}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg"
        >
          {isAuthenticated ? 'Reservar Ahora' : 'Inicia Sesión para Reservar'}
        </button>
      </div>
    </div>
  )
}
```

---

## ✅ Checklist: Verificar que todo funciona

```typescript
// 1. Verifica que .env.local tiene:
// NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

// 2. Crea una tabla en Supabase si no existe
// backend/supabase/migrations/XXXXXX_init.sql

// 3. En componente, prueba:
import { supabase } from '@/lib/supabase'

export function TestConnection() {
  const [status, setStatus] = useState('Checking...')

  useEffect(() => {
    const test = async () => {
      try {
        const { data, error } = await supabase.from('barbers').select('count')
        if (error) throw error
        setStatus('✅ Connected to Supabase!')
      } catch (err) {
        setStatus('❌ Connection failed')
      }
    }
    test()
  }, [])

  return <div>{status}</div>
}
```

---

## 🚀 Flujo de Desarrollo

```
1. Editar componente (frontend/)
2. Guardar (Ctrl+S)
3. Navegador actualiza automático ⚡
4. Cambios se reflejan en tiempo real
5. Si usas Supabase, los datos persisten automáticamente
```

---

## 📚 Tablas que Supabase necesita

Crear en Supabase SQL Editor:

```sql
-- Tabla de Barberos
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT,
  rating DECIMAL(3,1),
  image_url TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Reservas
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  barber_id UUID NOT NULL REFERENCES barbers(id),
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
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL,
  user_id UUID NOT NULL,
  barber_id UUID NOT NULL REFERENCES barbers(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔥 Ahora puedes:

✅ Crear componentes que consulten Supabase  
✅ Hacer login/signup con auth real  
✅ Listar barberos desde BD  
✅ Crear reservas  
✅ Ver reviews y ratings  
✅ Todo con hot reload instantáneo  

**¡A desarrollar!** 🚀
