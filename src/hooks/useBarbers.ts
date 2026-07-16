import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Barber } from '../lib/types'

export function useBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error: e } = await supabase.from('barbers').select('*').order('name')
        if (e) throw e
        setBarbers(data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading barbers')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const getBarber = (id: string) => barbers.find((b) => b.id === id)

  return { barbers, loading, error, getBarber }
}
