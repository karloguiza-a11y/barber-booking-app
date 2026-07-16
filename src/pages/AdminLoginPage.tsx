import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bebas text-accent">Panel Admin</h1>
          <p className="text-gray-500 text-sm">Solo para administradores</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-dark-secondary rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-primary text-white px-4 py-3 rounded-xl border border-dark-tertiary focus:border-accent focus:outline-none transition-colors"
              required autoFocus />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-primary text-white px-4 py-3 rounded-xl border border-dark-tertiary focus:border-accent focus:outline-none transition-colors"
              required />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="bg-accent text-dark-primary font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
            ← Volver al inicio
          </button>
        </form>
      </div>
    </div>
  )
}
