# 🚀 SERVIDOR DE DESARROLLO - Frontend Only + Supabase/Firebase

**Solo frontend = sin backend Node.js local = desarrollo rápido y limpio** ✨

---

## 📋 OPCIÓN A: Supabase (Recomendado - Similar a Firebase pero mejor SQL)

### 1️⃣ SETUP SUPABASE (5 minutos)

```bash
# 1. Crear cuenta en https://supabase.com
# 2. Crear proyecto nuevo
# 3. Copiar credenciales de Settings > API

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_KEY=eyJxxx...
```

### 2️⃣ INSTALAR DEPENDENCIAS (3 minutos)

```bash
cd frontend

# Instalar Supabase client
npm install @supabase/supabase-js

# O si usas otros paquetes ya presentes (axios, react-query)
npm install
```

### 3️⃣ CONFIGURAR .env.local

```bash
# frontend/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**⚠️ IMPORTANTE:** Variables con `NEXT_PUBLIC_` están disponibles en el frontend (seguro)

### 4️⃣ CREAR SUPABASE CLIENT

```typescript
// frontend/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 5️⃣ USAR EN COMPONENTES

```typescript
// Ejemplo: hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, loading, login, signup, logout }
}
```

### 6️⃣ LEVANTAR SERVIDOR DE DESARROLLO

```bash
cd frontend

npm run dev

# Output:
# > barber-booking-frontend@1.0.0 dev
# > next dev
#
# ▲ Next.js 14.0.0
# - Local:        http://localhost:3000
# - Environments: .env.local
#
# ✓ Ready in 2.1s
```

**✅ Ahora abre:** http://localhost:3000

---

## 🔥 OPCIÓN B: Firebase (Si prefieres Google)

### 1️⃣ SETUP FIREBASE (5 minutos)

```bash
# 1. Ir a https://firebase.google.com
# 2. Console > Create Project
# 3. Enable Auth + Firestore + Storage
# 4. Project Settings > General > Copy config
```

### 2️⃣ INSTALAR FIREBASE SDK

```bash
cd frontend

npm install firebase
```

### 3️⃣ CONFIGURAR .env.local

```bash
# frontend/.env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mybarbershop.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mybarbershop
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mybarbershop.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
```

### 4️⃣ CREAR FIREBASE CLIENT

```typescript
// frontend/lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
```

### 5️⃣ USAR EN COMPONENTES

```typescript
// hooks/useAuth.ts (Firebase version)
import { useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signup = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result.user
  }

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  const logout = async () => {
    await signOut(auth)
  }

  return { user, loading, signup, login, logout }
}
```

### 6️⃣ LEVANTAR SERVIDOR

```bash
cd frontend

npm run dev

# Igual que Supabase: http://localhost:3000
```

---

## 📊 COMPARATIVA: Supabase vs Firebase

| Feature | Supabase | Firebase |
|---------|----------|----------|
| **Database** | PostgreSQL (SQL) | Firestore (NoSQL) |
| **Facilidad** | Media (más SQL) | Fácil (docs excelentes) |
| **Precio** | Barato | Gratis hasta cierto punto |
| **Real-time** | ✅ Sí | ✅ Sí |
| **Auth** | ✅ Completo | ✅ Muy completo |
| **Storage** | ✅ S3-compatible | ✅ Cloud Storage |
| **Escalabilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **SQL Queries** | ✅ Sí (mejor para backend) | ❌ NoSQL (aprendes diferente) |

**👉 Recomendación:** Supabase si ya sabes SQL, Firebase si no.

---

## 🧪 TESTEAR SIN BACKEND

### A) Mock Data (Rápido para UI)

```typescript
// hooks/useBarbers.ts
import { useState, useEffect } from 'react'

const MOCK_BARBERS = [
  { id: 1, name: 'Carlos', specialty: 'Fade', rating: 4.8 },
  { id: 2, name: 'Juan', specialty: 'Design', rating: 4.9 },
  { id: 3, name: 'Pedro', specialty: 'Beard', rating: 4.7 },
]

export function useBarbers() {
  const [barbers, setBarbers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular delay de API
    setTimeout(() => {
      setBarbers(MOCK_BARBERS)
      setLoading(false)
    }, 500)
  }, [])

  return { barbers, loading }
}
```

### B) Usar Backend Mock (json-server)

```bash
# Instalar globalmente
npm install -g json-server

# Crear db.json
cat > db.json << 'EOF'
{
  "barbers": [
    { "id": 1, "name": "Carlos", "specialty": "Fade", "rating": 4.8 },
    { "id": 2, "name": "Juan", "specialty": "Design", "rating": 4.9 }
  ],
  "reservations": []
}
EOF

# Levantar servidor mock en puerto 3001
json-server --watch db.json --port 3001

# Luego en componentes:
fetch('http://localhost:3001/barbers')
  .then(res => res.json())
  .then(data => console.log(data))
```

### C) Usar Supabase/Firebase directamente

```typescript
// hooks/useBarbers.ts - Supabase
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export function useBarbers() {
  const [barbers, setBarbers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBarbers = async () => {
      const { data, error } = await supabase
        .from('barbers')
        .select('*')
        .eq('active', true)

      if (error) console.error(error)
      else setBarbers(data)
      setLoading(false)
    }

    fetchBarbers()
  }, [])

  return { barbers, loading }
}
```

---

## 🎯 ESTRUCTURA RECOMENDADA

```
frontend/
├── app/                    # Next.js pages
├── components/             # Componentes reutilizables
├── hooks/                  # Custom hooks (useAuth, useBarbers, etc)
│   ├── useAuth.ts
│   ├── useBarbers.ts
│   ├── useReservations.ts
│   └── useReviews.ts
├── lib/
│   ├── supabase.ts        # O firebase.ts
│   └── api-types.ts       # TypeScript types
├── .env.local             # Credenciales locales (gitignore)
└── .env.example           # Template sin secrets
```

---

## 🚦 STARTER CODE: Página de Login

```typescript
// frontend/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error en login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-3xl font-bold text-center">Barber Booking</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

---

## 🔧 COMANDOS PRINCIPALES

```bash
# 1. Instalar dependencias
cd frontend
npm install

# 2. Setup env
cp .env.example .env.local
# Editar con tus credenciales

# 3. Levantar dev server
npm run dev

# 4. Build para producción
npm run build

# 5. Servir build local
npm start

# 6. Type checking
npm run type-check

# 7. Lint
npm run lint
```

---

## 📱 WORKFLOW DIARIO DE DESARROLLO

```bash
# Mañana: Arrancar el proyecto
cd frontend
npm run dev

# Abrir navegador
open http://localhost:3000  # macOS
# o
start http://localhost:3000  # Windows
# o
firefox http://localhost:3000  # Linux

# Editar archivos en VS Code
# Next.js recarga automáticamente

# Hot reload funciona así:
# 1. Editas frontend/components/LoginForm.tsx
# 2. Guardas (Ctrl+S)
# 3. El navegador se actualiza automáticamente ⚡

# Cuando termines
Ctrl+C  # Para el servidor dev
```

---

## 🐛 TROUBLESHOOTING

### Error: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Error: "NEXT_PUBLIC_SUPABASE_URL is not defined"
```bash
# Verificar que .env.local existe
cat frontend/.env.local

# Si no existe, crearlo
echo "NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co" > frontend/.env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx..." >> frontend/.env.local
```

### Port 3000 ya en uso
```bash
# Usar otro puerto
npm run dev -- -p 3001
# O matar el proceso
npx fkill 3000  # Multiplataforma
```

### Cambios no se reflejan en navegador
```bash
# Hard refresh
Ctrl+Shift+R (Chrome/Firefox)
Cmd+Shift+R (macOS)

# O borrar .next
rm -rf .next
npm run dev
```

---

## ✅ CHECKLIST: LISTA PARA DESARROLLAR

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Frontend dependencies instaladas (`npm install` en carpeta frontend)
- [ ] `.env.local` creado con credenciales Supabase/Firebase
- [ ] `npm run dev` ejecutándose sin errores
- [ ] Navegador abierto en http://localhost:3000
- [ ] Ver página de inicio del app
- [ ] Editar un componente y verificar que hot-reload funciona
- [ ] ✅ LISTO PARA DESARROLLAR

---

## 🎯 SIGUIENTES PASOS

1. **Elige backend:** Supabase o Firebase
2. **Configura credenciales** en `.env.local`
3. **Instala SDK** (`npm install @supabase/supabase-js` o Firebase)
4. **Crea hooks personalizados** (useAuth, useBarbers, etc)
5. **Levanta dev server:** `npm run dev`
6. **¡Desarrolla!** 🚀

---

## 📚 RECURSOS

- **Supabase Docs:** https://supabase.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **React Hooks:** https://react.dev/reference/react/hooks

---

**¡Ya está! Solo frontend + BaaS (Backend as a Service) = desarrollo rápido y sin complicaciones.** 🎉
