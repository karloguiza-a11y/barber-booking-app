import { TIME_SLOTS, formatTime } from '../lib/timeSlots'

interface Props {
  bookedSlots: string[]
  selected: string | null
  onSelect: (slot: string) => void
  loading: boolean
}

export function TimeSlotPicker({ bookedSlots, selected, onSelect, loading }: Props) {
  if (loading) return <div className="text-center text-gray-400 py-8">Cargando horarios...</div>

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {TIME_SLOTS.map((slot) => {
        const booked = bookedSlots.includes(slot)
        const isSelected = selected === slot
        return (
          <button
            key={slot}
            onClick={() => !booked && onSelect(slot)}
            disabled={booked}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all active:scale-95 ${
              booked
                ? 'bg-dark-tertiary text-gray-600 cursor-not-allowed line-through'
                : isSelected
                ? 'bg-accent text-dark-primary font-bold shadow-lg'
                : 'bg-dark-secondary text-white hover:bg-dark-tertiary border border-dark-tertiary hover:border-accent'
            }`}
          >
            {formatTime(slot)}
          </button>
        )
      })}
    </div>
  )
}
