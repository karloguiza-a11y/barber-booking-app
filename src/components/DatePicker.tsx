import { toDateString, isPastDate } from '../lib/timeSlots'

interface Props {
  selected: string | null
  onSelect: (date: string) => void
}

function getDaysInView(): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (d.getDay() !== 0) days.push(toDateString(d))
  }
  return days
}

export function DatePicker({ selected, onSelect }: Props) {
  const days = getDaysInView()

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {days.map((dateStr) => {
        const [y, m, d] = dateStr.split('-').map(Number)
        const date = new Date(y, m - 1, d)
        const dayName = date.toLocaleDateString('es-MX', { weekday: 'short' })
        const dayNum = d
        const monthName = date.toLocaleDateString('es-MX', { month: 'short' })
        const past = isPastDate(dateStr)
        const isSelected = selected === dateStr

        return (
          <button
            key={dateStr}
            onClick={() => !past && onSelect(dateStr)}
            disabled={past}
            className={`py-3 px-2 rounded-xl flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
              past
                ? 'bg-dark-tertiary text-gray-600 cursor-not-allowed opacity-40'
                : isSelected
                ? 'bg-accent text-dark-primary font-bold shadow-lg'
                : 'bg-dark-secondary text-white hover:bg-dark-tertiary border border-dark-tertiary hover:border-accent'
            }`}
          >
            <span className="text-xs uppercase opacity-70">{dayName}</span>
            <span className="text-xl font-bold leading-none">{dayNum}</span>
            <span className="text-xs uppercase opacity-70">{monthName}</span>
          </button>
        )
      })}
    </div>
  )
}
