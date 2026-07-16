import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

interface LoginPageProps {
  onSuccess: () => void
  onSwitchToRegister: () => void
}

export default function LoginPage({ onSuccess, onSwitchToRegister }: LoginPageProps) {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      onSuccess()
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-dark-secondary p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bebas text-accent mb-6 text-center">Barber Booking</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-dark-tertiary text-white rounded border border-accent focus:outline-none focus:border-accent"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-dark-tertiary text-white rounded border border-accent focus:outline-none focus:border-accent"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-dark-primary font-bold py-2 rounded hover:bg-opacity-80 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
        <p className="text-white text-center mt-4">
          ¿No tienes cuenta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-accent hover:underline font-bold"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  )
}
