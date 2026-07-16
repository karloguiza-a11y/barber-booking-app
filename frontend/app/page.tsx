'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useBarbers } from '@/hooks/useBarbers'
import { useReviews } from '@/hooks/useReviews'

export default function Home() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth()
  const { barbers, loading: barbersLoading } = useBarbers()
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null)

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900">
        <nav className="bg-white shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">✂️ Barber Booking</h1>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Inicia Sesión
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl font-bold mb-4">Bienvenido a Barber Booking</h2>
            <p className="text-xl opacity-90 mb-8">
              Reserva tu corte con los mejores barberos de la ciudad
            </p>
            <Link
              href="/login"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Comenzar →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-4xl mb-4">💇</div>
              <h3 className="text-xl font-semibold mb-2">Barberos Expertos</h3>
              <p className="text-gray-600">Elige entre los mejores barberos de la ciudad</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Reserva Fácil</h3>
              <p className="text-gray-600">Elige tu fecha y hora que mejor te convenga</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Calificaciones</h3>
              <p className="text-gray-600">Lee opiniones reales de otros clientes</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">✂️ Barber Booking</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Hola, <span className="font-semibold">{user?.email?.split('@')[0]}</span>
            </span>
            <button
              onClick={() => logout()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Elige tu Barbero</h2>

        {barbersLoading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="mt-4 text-gray-600">Cargando barberos...</p>
          </div>
        ) : barbers.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4">
              No hay barberos disponibles. Por favor, crea algunos en Supabase.
            </p>
            <p className="text-sm text-gray-600">
              Ve a tu base de datos Supabase y agrega registros en la tabla "barbers"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map((barber) => (
              <BarberCard
                key={barber.id}
                barber={barber}
                isSelected={selectedBarberId === barber.id}
                onSelect={() => setSelectedBarberId(barber.id)}
              />
            ))}
          </div>
        )}

        {/* Selected Barber Details */}
        {selectedBarberId && (
          <BarberBooking barberId={selectedBarberId} />
        )}
      </div>
    </div>
  )
}

function BarberCard({ barber, isSelected, onSelect }: any) {
  const { reviews } = useReviews(barber.id)
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A'

  return (
    <div
      onClick={onSelect}
      className={`rounded-lg overflow-hidden shadow-lg cursor-pointer transition transform hover:scale-105 ${
        isSelected ? 'ring-4 ring-blue-600 scale-105' : ''
      }`}
    >
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-32 flex items-end justify-center p-4">
        <div className="text-5xl">💇</div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{barber.name}</h3>

        {barber.specialty && (
          <p className="text-sm text-gray-600 mb-2">Especialidad: {barber.specialty}</p>
        )}

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-yellow-500">
            ⭐ {avgRating}
          </span>
          <span className="text-sm text-gray-500">
            ({reviews.length} reviews)
          </span>
        </div>

        {barber.bio && (
          <p className="text-sm text-gray-700 mb-4">{barber.bio}</p>
        )}

        <button
          className={`w-full py-2 rounded-lg font-semibold transition ${
            isSelected
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
        >
          {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
        </button>
      </div>
    </div>
  )
}

function BarberBooking({ barberId }: { barberId: string }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [service, setService] = useState('Corte')
  const { user } = useAuth()
  const { barbers } = useBarbers()

  const barber = barbers.find((b) => b.id === barberId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Reserva enviada:\nBarbero: ${barber?.name}\nFecha: ${date}\nHora: ${time}\nServicio: ${service}`)
  }

  return (
    <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6">Reservar con {barber?.name}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Servicio
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600"
          >
            <option>Corte</option>
            <option>Corte + Barba</option>
            <option>Barba</option>
            <option>Afeitado</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Confirmar Reserva
        </button>
      </form>
    </div>
  )
}
