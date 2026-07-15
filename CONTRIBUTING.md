# Contribuir al Proyecto

## 🎯 Cómo Contribuir

1. **Fork el repositorio**
2. **Crear una rama feature**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Hacer cambios y commits**
   ```bash
   git commit -m "Add: descripción de cambios"
   ```
4. **Push a tu fork**
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. **Crear Pull Request**

## 📝 Reglas de Commits

### Formato
```
[TYPE]: Descripción breve

Descripción detallada si es necesario
```

### Tipos
- `feat:` - Nueva característica
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (sin cambiar código)
- `refactor:` - Refactorización
- `perf:` - Mejoras de performance
- `test:` - Añadir/modificar tests
- `chore:` - Tareas de mantenimiento

### Ejemplos
```
feat: Añadir notificaciones por SMS
fix: Corregir validación de email
docs: Actualizar guía de deployment
refactor: Simplificar BookingForm
```

## 🏗️ Estructura de Código

### Backend
- Servicios en `services/`
- Controladores en `controllers/`
- Middleware en `middleware/`
- Tipos en `types/`
- Esquemas de validación en `schemas/`

### Frontend
- Componentes en `components/`
- Hooks en `hooks/`
- Páginas en `app/`
- Tipos y esquemas en `lib/`

## ✨ Estándares de Código

### TypeScript
- Tipado explícito
- Evitar `any`
- Usar interfaces/types descriptivos

### Nombres
- CamelCase para variables/funciones
- PascalCase para componentes/clases
- UPPER_SNAKE_CASE para constantes

### Componentes React
- Usar hooks modernos
- Separar lógica en custom hooks
- Prop types o TypeScript
- Documentar con comentarios

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📚 Documentación

- Actualizar README.md
- Documentar nuevas APIs
- Añadir ejemplos
- Actualizar CHANGELOG.md

## 🐛 Reportar Bugs

1. **Verificar que no exista issue**
2. **Crear nuevo issue con:**
   - Descripción del problema
   - Pasos para reproducir
   - Resultado esperado
   - Resultado actual
   - Sistema operativo/navegador
   - Screenshots si aplica

## 💡 Sugerir Mejoras

1. **Crear issue con etiqueta `enhancement`**
2. **Describir:**
   - Problema que resuelve
   - Solución propuesta
   - Alternativas consideradas
   - Contexto adicional

## 📞 Contacto

- Email: karloguiza@gmail.com
- GitHub: @karloguiza-a11y

## 📜 Licencia

Al contribuir, aceptas que tus cambios se licencian bajo la licencia del proyecto (MIT).
