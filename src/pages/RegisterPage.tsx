import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

interface RegisterPageProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export default function RegisterPage({ onSuccess, onSwitchToLogin }: RegisterPageProps) {
  const { signup, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden')
      return
    }

    try {
      await signup(email, password, fullName)
      onSuccess()
    } catch (err) {
      console.error('Signup error:', err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-dark-secondary p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bebas text-accent mb-6 text-center">Crear Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Nombre Completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              className="w-full px-4 py-2 bg-dark-tertiary text-white rounded border border-accent focus:outline-none focus:border-accent"
              required
            />
          </div>
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
          <div className="mb-4">
            <label className="block text-white mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-dark-tertiary text-white rounded border border-accent focus:outline-none focus:border-accent"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-dark-tertiary text-white rounded border border-accent focus:outline-none focus:border-accent"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          {localError && <p className="text-red-500 mb-4 text-sm">{localError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-dark-primary font-bold py-2 rounded hover:bg-opacity-80 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
        </form>
        <p className="text-white text-center mt-4">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-accent hover:underline font-bold"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  )
}
