import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DatePicker } from '../components/DatePicker'
import { TimeSlotPicker } from '../components/TimeSlotPicker'
import { useBarbers } from '../hooks/useBarbers'
import { useAvailability } from '../hooks/useAvailability'
import { useBooking } from '../hooks/useBooking'
import { formatDate, formatTime } from '../lib/timeSlots'

type Step = 'date' | 'time' | 'details' | 'done'

export default function BookingPage() {
  const { barberId = '' } = useParams()
  const navigate = useNavigate()
  const { getBarber } = useBarbers()
  const barber = getBarber(barberId)

  const [step, setStep] = useState<Step>('date')
  const [date, setDate] = useState<string | null>(null)
  const [timeSlot, setTimeSlot] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const { bookedSlots, loading: availLoading } = useAvailability(barberId, date ?? '')
  const { createBooking, loading: bookingLoading, error: bookingError } = useBooking()

  const handleConfirm = async () => {
    if (!date || !timeSlot || !name.trim() || !phone.trim()) return
    const ok = await createBooking({ barber_id: barberId, date, time_slot: timeSlot, client_name: name.trim(), client_phone: phone.trim() })
    if (ok) setStep('done')
  }

  if (!barber) {
    return (
      <div className="min-h-screen bg-dark-primary flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl">Barbero no encontrado</p>
        <button onClick={() => navigate('/')} className="text-accent underline">Volver al inicio</button>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-dark-primary flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-bebas text-accent mb-2">¡Cita Confirmada!</h2>
        <p className="text-white mb-1">{barber.name}</p>
        <p className="text-gray-300 mb-1">{date && formatDate(date)}</p>
        <p className="text-gray-300 mb-6">{timeSlot && formatTime(timeSlot)}</p>
        <p className="text-gray-400 text-sm mb-8">Te esperamos, {name}. Si necesitas cancelar llama al {barber.phone}.</p>
        <button onClick={() => navigate('/')} className="bg-accent text-dark-primary font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-all">
          Reservar otra cita
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      <header className="bg-dark-secondary border-b border-dark-tertiary px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors text-xl">←</button>
        <div className="flex items-center gap-3">
          {barber.image_url && <img src={barber.image_url} alt={barber.name} className="w-10 h-10 rounded-full object-cover" />}
          <div>
            <h1 className="text-xl font-bebas text-accent leading-none">{barber.name}</h1>
            <p className="text-gray-400 text-xs">{barber.specialty}</p>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {(['date', 'time', 'details'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s ? 'bg-accent text-dark-primary' : (step === 'time' && i === 0) || (step === 'details' && i < 2) ? 'bg-accent/40 text-white' : 'bg-dark-tertiary text-gray-500'
              }`}>{i + 1}</div>
              {i < 2 && <div className="flex-1 h-px bg-dark-tertiary" />}
            </div>
          ))}
        </div>

        {/* Step 1: Date */}
        {step === 'date' && (
          <>
            <h2 className="text-2xl font-bebas text-white mb-4">Elige el día</h2>
            <DatePicker selected={date} onSelect={(d) => { setDate(d); setTimeSlot(null); setStep('time') }} />
          </>
        )}

        {/* Step 2: Time */}
        {step === 'time' && date && (
          <>
            <button onClick={() => setStep('date')} className="text-accent text-sm mb-4 hover:underline">← {formatDate(date)}</button>
            <h2 className="text-2xl font-bebas text-white mb-4">Elige el horario</h2>
            <TimeSlotPicker bookedSlots={bookedSlots} selected={timeSlot} onSelect={(t) => { setTimeSlot(t); setStep('details') }} loading={availLoading} />
            {bookedSlots.length > 0 && <p className="text-gray-500 text-xs mt-3">Los horarios tachados ya están ocupados.</p>}
          </>
        )}

        {/* Step 3: Details */}
        {step === 'details' && date && timeSlot && (
          <>
            <div className="bg-dark-secondary rounded-xl p-4 mb-6 border border-dark-tertiary">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-accent font-bold">{formatDate(date)}</p>
                  <p className="text-white text-lg font-bebas">{formatTime(timeSlot)}</p>
                </div>
                <button onClick={() => setStep('time')} className="text-gray-400 text-xs hover:text-white">Cambiar</button>
              </div>
            </div>
            <h2 className="text-2xl font-bebas text-white mb-4">Tus datos</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Nombre *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full bg-dark-secondary text-white px-4 py-3 rounded-xl border border-dark-tertiary focus:border-accent focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Teléfono *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="w-full bg-dark-secondary text-white px-4 py-3 rounded-xl border border-dark-tertiary focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              {bookingError && <p className="text-red-400 text-sm">{bookingError}</p>}
              <button
                onClick={handleConfirm}
                disabled={bookingLoading || !name.trim() || !phone.trim()}
                className="w-full bg-accent text-dark-primary font-bold py-4 rounded-xl hover:bg-yellow-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-wide"
              >
                {bookingLoading ? 'Confirmando...' : 'CONFIRMAR CITA'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

