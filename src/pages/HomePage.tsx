import { useNavigate } from 'react-router-dom'
import { BarberCard } from '../components/BarberCard'
import { useBarbers } from '../hooks/useBarbers'

export default function HomePage() {
  const navigate = useNavigate()
  const { barbers, loading, error } = useBarbers()

  return (
    <div className="min-h-screen bg-dark-primary">
      <header className="bg-dark-secondary border-b border-dark-tertiary px-6 py-4 flex justify-between items-center">
        <h1 className="text-4xl font-bebas text-accent tracking-wide">Barber Booking</h1>
        <button
          onClick={() => navigate('/admin/login')}
          className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
        >
          Admin
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bebas text-white mb-2">Elige a tu barbero</h2>
          <p className="text-gray-400">Selecciona al estilista que prefieras y reserva tu cita al instante.</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-48">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-center text-red-400 py-8">Error al cargar barberos: {error}</p>
        )}

        {!loading && !error && barbers.length === 0 && (
          <p className="text-center text-gray-500 py-16 text-lg">No hay barberos disponibles por el momento.</p>
        )}

        {!loading && !error && barbers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} onBook={(id) => navigate(`/booking/${id}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
