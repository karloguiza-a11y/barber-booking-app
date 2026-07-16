import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAdmin } from '../hooks/useAdmin'
import { useBarbers } from '../hooks/useBarbers'
import { formatDate, formatTime } from '../lib/timeSlots'
import type { Reservation } from '../lib/types'
import { useEffect } from 'react'

const STATUS_LABELS: Record<Reservation['status'], string> = {
  pending: 'Pendiente',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

const STATUS_COLORS: Record<Reservation['status'], string> = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  completed: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
}

export default function AdminPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading, logout } = useAuth()
  const { reservations, loading, updateStatus } = useAdmin()
  const { getBarber } = useBarbers()

  useEffect(() => {
    if (!authLoading && !user) navigate('/admin/login')
  }, [authLoading, user, navigate])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const pending = reservations.filter((r) => r.status === 'pending')
  const rest = reservations.filter((r) => r.status !== 'pending')

  return (
    <div className="min-h-screen bg-dark-primary">
      <header className="bg-dark-secondary border-b border-dark-tertiary px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bebas text-accent">Panel Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user?.email}</span>
          <button onClick={async () => { await logout(); navigate('/admin/login') }}
            className="text-gray-400 hover:text-white text-sm transition-colors">Salir</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-secondary rounded-xl p-4 text-center">
            <p className="text-3xl font-bebas text-accent">{reservations.filter((r) => r.status === 'pending').length}</p>
            <p className="text-gray-400 text-xs">Pendientes</p>
          </div>
          <div className="bg-dark-secondary rounded-xl p-4 text-center">
            <p className="text-3xl font-bebas text-green-400">{reservations.filter((r) => r.status === 'completed').length}</p>
            <p className="text-gray-400 text-xs">Completadas</p>
          </div>
          <div className="bg-dark-secondary rounded-xl p-4 text-center">
            <p className="text-3xl font-bebas text-white">{reservations.length}</p>
            <p className="text-gray-400 text-xs">Total</p>
          </div>
        </div>

        <h2 className="text-xl font-bebas text-white mb-4">Citas pendientes ({pending.length})</h2>
        {pending.length === 0 && <p className="text-gray-500 text-sm mb-8">No hay citas pendientes.</p>}
        <div className="flex flex-col gap-3 mb-8">
          {pending.map((r) => (
            <ReservationCard key={r.id} reservation={r} barberName={getBarber(r.barber_id)?.name ?? r.barber_id} onUpdate={updateStatus} />
          ))}
        </div>

        {rest.length > 0 && (
          <>
            <h2 className="text-xl font-bebas text-white mb-4">Historial</h2>
            <div className="flex flex-col gap-3">
              {rest.map((r) => (
                <ReservationCard key={r.id} reservation={r} barberName={getBarber(r.barber_id)?.name ?? r.barber_id} onUpdate={updateStatus} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function ReservationCard({ reservation: r, barberName, onUpdate }: {
  reservation: Reservation
  barberName: string
  onUpdate: (id: string, status: Reservation['status']) => void
}) {
  return (
    <div className="bg-dark-secondary rounded-xl p-4 border border-dark-tertiary flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">{r.client_name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
        </div>
        <p className="text-gray-400 text-sm">📞 {r.client_phone}</p>
        <p className="text-accent text-sm">✂️ {barberName}</p>
        <p className="text-gray-300 text-sm">{formatDate(r.date)} · {formatTime(r.time_slot)}</p>
      </div>
      {r.status === 'pending' && (
        <div className="flex gap-2">
          <button onClick={() => onUpdate(r.id, 'completed')}
            className="bg-green-500/10 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-lg text-sm transition-colors">
            ✓ Completar
          </button>
          <button onClick={() => onUpdate(r.id, 'cancelled')}
            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-sm transition-colors">
            ✗ Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
