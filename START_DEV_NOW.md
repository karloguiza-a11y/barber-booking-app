# 🚀 LEVANTA EL SERVIDOR AHORA MISMO

## El cambio de estrategia:

✅ **Enfoque:** Frontend puro + Firebase/Supabase como backend  
✅ **Objetivo:** Ver la app funcionando en desarrollo  
✅ **Sin:** Backend Node.js local (innecesario)

---

## 🎯 EL COMANDO (Copiar y Pegar)

```bash
cd frontend && npm install && npm run dev
```

**Eso es todo.** ✨

---

## ¿Qué pasa después?

```
✓ Instala dependencias
✓ Levanta servidor en http://localhost:3000
✓ Abre navegador automáticamente
✓ Hot reload activado (cambios en tiempo real)
```

---

## Después de ejecutar el comando, verás:

```
> barber-booking-frontend@1.0.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

**Abre:** http://localhost:3000

---

## ✅ Setup de credenciales (una sola vez)

Antes de correr el comando, necesitas 1 cosa:

### Opción A: Firebase ⭐ (Recomendado - más fácil)

```bash
# 1. Ir a https://firebase.google.com
# 2. Crear proyecto
# 3. Copiar estas 5 líneas en frontend/.env.local:

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=barbershop.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=barbershop
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=barbershop.appspot.com
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
```

### Opción B: Supabase (Si prefieres SQL)

```bash
# 1. Ir a https://supabase.com
# 2. Crear proyecto
# 3. Copiar en frontend/.env.local:

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

---

## 📋 Paso a Paso (Primera Vez)

```bash
# 1. Navega a la carpeta frontend
cd frontend

# 2. Copia uno de estos en archivo: .env.local
#    (Opción A o B arriba)

# 3. Ejecuta:
npm install

# 4. Luego:
npm run dev

# 5. Ve a:
# http://localhost:3000
```

---

## 🛑 Para cuando termines

```bash
# Presiona en la terminal:
Ctrl + C

# El servidor se detiene
```

---

## 📱 La app está lista para:

- ✅ Ver la interfaz completa
- ✅ Testear diseño (Tailwind CSS)
- ✅ Probar formularios (React Hook Form)
- ✅ Conectar con Firebase/Supabase para auth
- ✅ Hacer llamadas a base de datos

---

## 🔥 Lo importante:

El **backend ya no te importa.**  
Supabase/Firebase es tu backend.  
**Tú enfocas PURO en el frontend.**

---

## 🎬 Próximos pasos para Uriel:

```
1. Elige: Firebase o Supabase
2. Crea cuenta (gratuito)
3. Copia credenciales en frontend/.env.local
4. Ejecuta: cd frontend && npm install && npm run dev
5. ¡A programar! 🚀
```

---

**¡Ya está! Solo ese comando. Todo lo demás es automático.** ⚡
