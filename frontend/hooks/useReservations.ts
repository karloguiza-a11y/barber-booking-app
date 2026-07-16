'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Reservation {
  id: string
  user_id: string
  barber_id: string
  service: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  price?: number
  notes?: string
  created_at: string
  updated_at: string
}

interface UseReservationsReturn {
  reservations: Reservation[]
  loading: boolean
  error: string | null
  createReservation: (data: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) => Promise<Reservation>
  updateReservation: (id: string, data: Partial<Reservation>) => Promise<Reservation>
  cancelReservation: (id: string) => Promise<void>
}

export function useReservations(userId?: string): UseReservationsReturn {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setError(null)
        let query = supabase.from('reservations').select('*')

        if (userId) {
          query = query.eq('user_id', userId)
        }

        const { data, error: err } = await query.order('date', { ascending: false })

        if (err) throw err
        setReservations(data || [])
      } catch (err: any) {
        console.error('Error fetching reservations:', err)
        setError(err?.message || 'Failed to fetch reservations')
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()

    // Subscribe to changes
    const subscription = supabase
      .from('reservations')
      .on('*', (payload) => {
        setReservations((prev) => {
          if (payload.eventType === 'DELETE') {
            return prev.filter((r) => r.id !== payload.old.id)
          }
          if (payload.eventType === 'INSERT') {
            return [payload.new as Reservation, ...prev]
          }
          if (payload.eventType === 'UPDATE') {
            return prev.map((r) => (r.id === payload.new.id ? (payload.new as Reservation) : r))
          }
          return prev
        })
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  const createReservation = async (data: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: newReservation, error: err } = await supabase
        .from('reservations')
        .insert([data])
        .select()
        .single()

      if (err) throw err
      return newReservation as Reservation
    } catch (err: any) {
      const message = err?.message || 'Failed to create reservation'
      setError(message)
      throw err
    }
  }

  const updateReservation = async (id: string, data: Partial<Reservation>) => {
    try {
      const { data: updated, error: err } = await supabase
        .from('reservations')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err
      return updated as Reservation
    } catch (err: any) {
      const message = err?.message || 'Failed to update reservation'
      setError(message)
      throw err
    }
  }

  const cancelReservation = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (err) throw err
    } catch (err: any) {
      const message = err?.message || 'Failed to cancel reservation'
      setError(message)
      throw err
    }
  }

  return {
    reservations,
    loading,
    error,
    createReservation,
    updateReservation,
    cancelReservation,
  }
}
