import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface BookingData {
  barber_id: string
  date: string
  time_slot: string
  client_name: string
  client_phone: string
}

export function useBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const createBooking = async (data: BookingData) => {
    setLoading(true)
    setError(null)
    try {
      // Double-check slot is still available
      const { data: existing } = await supabase
        .from('reservations')
        .select('id')
        .eq('barber_id', data.barber_id)
        .eq('date', data.date)
        .eq('time_slot', data.time_slot)
        .neq('status', 'cancelled')
        .single()

      if (existing) {
        setError('Este horario ya fue reservado. Por favor elige otro.')
        return false
      }

      const { error: e } = await supabase.from('reservations').insert({
        ...data,
        status: 'pending',
      })
      if (e) throw e
      setSuccess(true)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la reserva')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { createBooking, loading, error, success }
}
