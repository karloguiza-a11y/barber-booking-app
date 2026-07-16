#!/bin/bash

echo "🚀 Barber Booking Backend - Instalación y Verificación"
echo "========================================================"
echo ""

# Cambiar al directorio backend
cd backend

echo "📦 Paso 1: Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error durante la instalación de dependencias"
    exit 1
fi
echo "✅ Dependencias instaladas correctamente"
echo ""

echo "🔨 Paso 2: Compilando TypeScript..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error durante la compilación"
    exit 1
fi
echo "✅ Compilación completada"
echo ""

echo "✔️ Paso 3: Verificando tipos TypeScript..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Error en verificación de tipos"
    exit 1
fi
echo "✅ Type-check pasado"
echo ""

echo "🧪 Paso 4: Ejecutando tests..."
npm test
if [ $? -ne 0 ]; then
    echo "⚠️ Algunos tests fallaron, pero la configuración está lista"
fi
echo ""

echo "📊 Paso 5: Generando reporte de cobertura..."
npm run test:coverage
echo ""

echo "✨ ========================================================"
echo "✅ ¡Instalación completada exitosamente!"
echo "✨ ========================================================"
echo ""
echo "📝 Scripts disponibles:"
echo "  - npm run dev              : Iniciar en modo desarrollo"
echo "  - npm run build            : Compilar TypeScript"
echo "  - npm run start            : Ejecutar versión compilada"
echo "  - npm test                 : Ejecutar tests"
echo "  - npm run test:watch       : Tests en modo watch"
echo "  - npm run test:coverage    : Reporte de cobertura"
echo "  - npm run type-check       : Verificar tipos"
echo "  - npm run lint             : Ejecutar ESLint"
echo ""
echo "📚 Documentación Swagger disponible en:"
echo "  http://localhost:5000/api/docs"
echo ""
echo "Para iniciar el servidor: npm run dev"
