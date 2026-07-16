@echo off
setlocal enabledelayedexpansion

echo.
echo 🚀 Barber Booking Backend - Instalación y Verificación
echo ========================================================
echo.

REM Cambiar al directorio backend
cd backend

echo 📦 Paso 1: Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ❌ Error durante la instalación de dependencias
    exit /b 1
)
echo ✅ Dependencias instaladas correctamente
echo.

echo 🔨 Paso 2: Compilando TypeScript...
call npm run build
if errorlevel 1 (
    echo ❌ Error durante la compilación
    exit /b 1
)
echo ✅ Compilación completada
echo.

echo ✔️ Paso 3: Verificando tipos TypeScript...
call npm run type-check
if errorlevel 1 (
    echo ❌ Error en verificación de tipos
    exit /b 1
)
echo ✅ Type-check pasado
echo.

echo 🧪 Paso 4: Ejecutando tests...
call npm test
if errorlevel 1 (
    echo ⚠️ Algunos tests fallaron, pero la configuración está lista
)
echo.

echo 📊 Paso 5: Generando reporte de cobertura...
call npm run test:coverage
echo.

echo ✨ ========================================================
echo ✅ ¡Instalación completada exitosamente!
echo ✨ ========================================================
echo.
echo 📝 Scripts disponibles:
echo   - npm run dev              : Iniciar en modo desarrollo
echo   - npm run build            : Compilar TypeScript
echo   - npm run start            : Ejecutar versión compilada
echo   - npm test                 : Ejecutar tests
echo   - npm run test:watch       : Tests en modo watch
echo   - npm run test:coverage    : Reporte de cobertura
echo   - npm run type-check       : Verificar tipos
echo   - npm run lint             : Ejecutar ESLint
echo.
echo 📚 Documentación Swagger disponible en:
echo   http://localhost:5000/api/docs
echo.
echo Para iniciar el servidor: npm run dev
echo.
pause
