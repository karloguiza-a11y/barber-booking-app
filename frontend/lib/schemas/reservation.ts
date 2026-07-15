import { z } from 'zod'

export const createReservationSchema = z.object({
  barberId: z.string().min(1, 'Selecciona un barbero'),
  serviceId: z.string().min(1, 'Selecciona un servicio'),
  appointmentDate: z.string().min(1, 'Selecciona una fecha'),
  startTime: z.string().min(1, 'Selecciona una hora'),
  notes: z.string().optional(),
})

export type CreateReservationData = z.infer<typeof createReservationSchema>
