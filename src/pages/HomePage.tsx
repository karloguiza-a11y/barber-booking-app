import { useAuth, User } from '../hooks/useAuth'
import { Barber } from '../hooks/useBarbers'

interface HomePageProps {
  user: User | null
  barbers: Barber[]
  barbersLoading: boolean
  getBarberRating: (barberId: string) => number
}

export default function HomePage({ user, barbers, barbersLoading, getBarberRating }: HomePageProps) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary p-8">
      <header className="mb-12 flex justify-between items-center">
        <h1 className="text-5xl font-bebas text-accent">Barber Booking</h1>
        <div className="flex items-center gap-4">
          <span className="text-white">Bienvenido, {user?.user_metadata?.full_name || user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-accent text-dark-primary px-4 py-2 rounded font-bold hover:bg-opacity-80"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main>
        <h2 className="text-3xl font-bebas text-white mb-8">Nuestros Barberos</h2>
        
        {barbersLoading ? (
          <div className="text-center text-white text-xl">Cargando barberos...</div>
        ) : barbers.length === 0 ? (
          <div className="text-center text-white text-xl">No hay barberos disponibles</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map((barber) => (
              <div key={barber.id} className="bg-dark-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {barber.image_url && (
                  <img
                    src={barber.image_url}
                    alt={barber.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bebas text-accent mb-2">{barber.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{barber.specialty}</p>
                  <p className="text-white mb-3">{barber.bio}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-accent font-bold">
                      ⭐ {getBarberRating(barber.id)}/5
                    </span>
                    <span className="text-gray-400">{barber.phone}</span>
                  </div>

                  <button className="w-full bg-accent text-dark-primary font-bold py-2 rounded hover:bg-opacity-80">
                    Reservar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
