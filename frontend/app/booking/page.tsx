import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reservar Cita - Barber Shop',
  description: 'Reserva tu cita con nosotros',
}

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Reservar Cita</h1>
      {/* Booking form will be added here */}
    </div>
  )
}
