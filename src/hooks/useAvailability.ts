import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAvailability(barberId: string, date: string) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!barberId || !date) return
    setLoading(true)
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('reservations')
          .select('time_slot')
          .eq('barber_id', barberId)
          .eq('date', date)
          .neq('status', 'cancelled')
        setBookedSlots((data ?? []).map((r) => r.time_slot))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [barberId, date])

  const isBooked = (slot: string) => bookedSlots.includes(slot)

  return { bookedSlots, loading, isBooked }
}
