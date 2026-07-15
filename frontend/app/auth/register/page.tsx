import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registro - Barber Shop',
  description: 'Crea tu cuenta para reservar citas',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white dark:bg-dark-secondary rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Crear Cuenta</h1>
        {/* Form will be added here */}
      </div>
    </div>
  )
}
