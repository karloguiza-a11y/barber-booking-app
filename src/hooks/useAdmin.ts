import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Reservation } from '../lib/types'

export function useAdmin() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const { data, error: e } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true })
        .order('time_slot', { ascending: true })
      if (e) throw e
      setReservations(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading reservations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
    const channel = supabase
      .channel('admin-reservations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchReservations)
      .subscribe()
    return () => { channel.unsubscribe() }
  }, [])

  const updateStatus = async (id: string, status: Reservation['status']) => {
    await supabase.from('reservations').update({ status }).eq('id', id)
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  return { reservations, loading, error, updateStatus }
}
