'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Barber {
  id: string
  name: string
  specialty?: string
  rating?: number
  image_url?: string
  phone?: string
  bio?: string
}

interface UseBarBersReturn {
  barbers: Barber[]
  loading: boolean
  error: string | null
  getBarber: (id: string) => Promise<Barber | null>
}

export function useBarbers(): UseBarBersReturn {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setError(null)
        const { data, error: err } = await supabase
          .from('barbers')
          .select('*')
          .order('name', { ascending: true })

        if (err) throw err
        setBarbers(data || [])
      } catch (err: any) {
        console.error('Error fetching barbers:', err)
        setError(err?.message || 'Failed to fetch barbers')
      } finally {
        setLoading(false)
      }
    }

    fetchBarbers()

    // Subscribe to realtime changes using new API
    const channel = supabase
      .channel('barbers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'barbers',
        },
        (payload: any) => {
          if (payload.eventType === 'DELETE') {
            setBarbers((prev) => prev.filter((b) => b.id !== payload.old.id))
          } else if (payload.eventType === 'INSERT') {
            setBarbers((prev) => [...prev, payload.new as Barber])
          } else if (payload.eventType === 'UPDATE') {
            setBarbers((prev) =>
              prev.map((b) => (b.id === payload.new.id ? (payload.new as Barber) : b))
            )
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const getBarber = async (id: string): Promise<Barber | null> => {
    try {
      const { data, error: err } = await supabase
        .from('barbers')
        .select('*')
        .eq('id', id)
        .single()

      if (err) throw err
      return data as Barber
    } catch (err) {
      console.error('Error fetching barber:', err)
      return null
    }
  }

  return { barbers, loading, error, getBarber }
}
