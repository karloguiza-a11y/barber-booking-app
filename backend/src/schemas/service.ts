import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters'),
  description: z.string().optional(),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  price: z.number().positive('Price must be positive'),
});

export const updateServiceSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  duration: z.number().optional(),
  price: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
