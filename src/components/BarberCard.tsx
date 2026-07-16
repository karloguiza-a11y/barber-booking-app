import type { Barber } from '../lib/types'

interface Props {
  barber: Barber
  onBook: (id: string) => void
}

export function BarberCard({ barber, onBook }: Props) {
  return (
    <div className="bg-dark-secondary rounded-2xl overflow-hidden shadow-lg hover:shadow-accent/20 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="h-56 overflow-hidden bg-dark-tertiary">
        {barber.image_url ? (
          <img src={barber.image_url} alt={barber.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">✂️</div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-2xl font-bebas text-accent">{barber.name}</h3>
        <p className="text-gray-400 text-sm mb-2">{barber.specialty}</p>
        {barber.bio && <p className="text-gray-300 text-sm mb-4 flex-1">{barber.bio}</p>}
        {barber.phone && (
          <p className="text-gray-500 text-xs mb-3">📞 {barber.phone}</p>
        )}
        <button
          onClick={() => onBook(barber.id)}
          className="w-full bg-accent text-dark-primary font-bold py-3 rounded-xl hover:bg-yellow-400 active:scale-95 transition-all text-sm tracking-wide"
        >
          RESERVAR AHORA
        </button>
      </div>
    </div>
  )
}
