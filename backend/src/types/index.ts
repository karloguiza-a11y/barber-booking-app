import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
