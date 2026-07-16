import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useBarbers } from './hooks/useBarbers'
import { useReviews } from './hooks/useReviews'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'

function App() {
  const { user, loading: authLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'register'>('home')
  const { barbers, loading: barbersLoading } = useBarbers()
  const { getBarberRating } = useReviews()

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-dark-primary to-dark-secondary">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary">
        {currentPage === 'login' && (
          <LoginPage onSuccess={() => setCurrentPage('home')} onSwitchToRegister={() => setCurrentPage('register')} />
        )}
        {currentPage === 'register' && (
          <RegisterPage onSuccess={() => setCurrentPage('home')} onSwitchToLogin={() => setCurrentPage('login')} />
        )}
        {currentPage === 'home' && (
          <LoginPage onSuccess={() => setCurrentPage('home')} onSwitchToRegister={() => setCurrentPage('register')} />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary">
      <HomePage user={user} barbers={barbers} barbersLoading={barbersLoading} getBarberRating={getBarberRating} />
    </div>
  )
}

export default App
