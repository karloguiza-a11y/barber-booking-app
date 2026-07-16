export interface Barber {
  id: string
  name: string
  specialty: string
  image_url: string
  phone: string
  bio: string
}

export interface Reservation {
  id: string
  barber_id: string
  client_name: string
  client_phone: string
  date: string
  time_slot: string
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
}

export type BookingStep = 'date' | 'time' | 'details' | 'confirm'
