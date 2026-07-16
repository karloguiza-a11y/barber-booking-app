'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Review {
  id: string
  reservation_id: string
  user_id: string
  barber_id: string
  rating: number
  comment: string
  created_at: string
}

interface UseReviewsReturn {
  reviews: Review[]
  loading: boolean
  error: string | null
  createReview: (data: Omit<Review, 'id' | 'created_at'>) => Promise<Review>
  deleteReview: (id: string) => Promise<void>
  getBarberRating: (barberId: string) => number
}

export function useReviews(barberId?: string): UseReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setError(null)
        let query = supabase.from('reviews').select('*')

        if (barberId) {
          query = query.eq('barber_id', barberId)
        }

        const { data, error: err } = await query.order('created_at', { ascending: false })

        if (err) throw err
        setReviews(data || [])
      } catch (err: any) {
        console.error('Error fetching reviews:', err)
        setError(err?.message || 'Failed to fetch reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()

    // Subscribe to changes using new API
    const channel = supabase
      .channel('reviews')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
        },
        (payload: any) => {
          setReviews((prev) => {
            if (payload.eventType === 'DELETE') {
              return prev.filter((r) => r.id !== payload.old.id)
            }
            if (payload.eventType === 'INSERT') {
              return [payload.new as Review, ...prev]
            }
            if (payload.eventType === 'UPDATE') {
              return prev.map((r) => (r.id === payload.new.id ? (payload.new as Review) : r))
            }
            return prev
          })
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [barberId])

  const createReview = async (data: Omit<Review, 'id' | 'created_at'>) => {
    try {
      if (data.rating < 1 || data.rating > 5) {
        throw new Error('Rating must be between 1 and 5')
      }

      const { data: newReview, error: err } = await supabase
        .from('reviews')
        .insert([data])
        .select()
        .single()

      if (err) throw err
      return newReview as Review
    } catch (err: any) {
      const message = err?.message || 'Failed to create review'
      setError(message)
      throw err
    }
  }

  const deleteReview = async (id: string) => {
    try {
      const { error: err } = await supabase.from('reviews').delete().eq('id', id)

      if (err) throw err
    } catch (err: any) {
      const message = err?.message || 'Failed to delete review'
      setError(message)
      throw err
    }
  }

  const getBarberRating = (barberId: string): number => {
    const barberReviews = reviews.filter((r) => r.barber_id === barberId)

    if (barberReviews.length === 0) return 0

    const average =
      barberReviews.reduce((sum, r) => sum + r.rating, 0) / barberReviews.length

    return Math.round(average * 10) / 10
  }

  return {
    reviews,
    loading,
    error,
    createReview,
    deleteReview,
    getBarberRating,
  }
}
