import { z } from 'zod';
import { nameSchema, phoneSchema } from '../utils/validators.js';

export const createBarberSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: z.string().email(),
  phone: phoneSchema,
  specialty: z.string().min(3),
  bio: z.string().optional(),
});

export const updateBarberSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  specialty: z.string().optional(),
  bio: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateBarberInput = z.infer<typeof createBarberSchema>;
export type UpdateBarberInput = z.infer<typeof updateBarberSchema>;
