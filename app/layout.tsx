import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Barber Booking - Reserva tu cita',
  description: 'Reserva tu cita de barbería online',
  keywords: 'barbería, reservas, cortes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
