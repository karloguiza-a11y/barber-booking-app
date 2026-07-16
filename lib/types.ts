export interface User {
  id: string
  email: string
  role: 'CLIENT' | 'BARBER' | 'ADMIN'
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  image?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Barber {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  photo?: string
  specialty: string
  bio?: string
  rating: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Reservation {
  id: string
  clientId: string
  barberId: string
  serviceId: string
  appointmentDate: string
  startTime: string
  endTime: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
  notes?: string
  totalPrice: number
  createdAt: string
  updatedAt: string
}
