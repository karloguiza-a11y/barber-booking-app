import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Barber Shop',
  description: 'Inicia sesión en tu cuenta',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white dark:bg-dark-secondary rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
        {/* Form will be added here */}
      </div>
    </div>
  )
}
