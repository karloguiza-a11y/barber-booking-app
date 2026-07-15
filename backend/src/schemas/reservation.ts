import { z } from 'zod';

export const createReservationSchema = z.object({
  barberId: z.string().min(1, 'Barber ID is required'),
  serviceId: z.string().min(1, 'Service ID is required'),
  appointmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  notes: z.string().optional(),
});

export const updateReservationSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
  notes: z.string().optional(),
  barberId: z.string().optional(),
  serviceId: z.string().optional(),
  appointmentDate: z.string().optional(),
  startTime: z.string().optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
