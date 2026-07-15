import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inicio - Barber Shop',
  description: 'Bienvenido a la mejor barbería premium',
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Placeholder for home page */}
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-4">Barber Shop</h1>
        <p className="text-lg text-gray-600">Premium Barbershop Experience</p>
      </div>
    </main>
  )
}
