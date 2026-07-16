'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check current session
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (err) {
        console.error('Auth init error:', err)
        setError('Error initializing authentication')
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setError(null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (err) throw err
      router.push('/dashboard')
    } catch (err: any) {
      const errorMsg = err?.message || 'Login failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [router])

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    try {
      setError(null)
      setLoading(true)
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      })
      if (err) throw err
    } catch (err: any) {
      const errorMsg = err?.message || 'Signup failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setError(null)
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err
      setUser(null)
      router.push('/login')
    } catch (err: any) {
      const errorMsg = err?.message || 'Logout failed'
      setError(errorMsg)
      throw err
    }
  }, [router])

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }
}

// Mutation-style hook for React Query compatibility
export const useRegister = () => {
  const { signup, loading, error } = useAuth()

  return {
    mutate: (data: { email: string; password: string; name?: string }) =>
      signup(data.email, data.password, data.name),
    isPending: loading,
    error,
  }
}

export const useLogin = () => {
  const { login, loading, error } = useAuth()

  return {
    mutate: (data: { email: string; password: string }) =>
      login(data.email, data.password),
    isPending: loading,
    error,
  }
}
