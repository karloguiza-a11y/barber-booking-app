import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Barber Shop - Reserva tu cita',
  description: 'La mejor barbería premium de la ciudad. Reserva tu cita online.',
  keywords: 'barbería, reservas, cortes, afeitado',
  openGraph: {
    title: 'Barber Shop - Reserva tu cita',
    description: 'La mejor barbería premium de la ciudad',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
