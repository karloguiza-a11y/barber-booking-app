import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { AuthService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../schemas/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const authService = new AuthService();

export const registerClient = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);
    res.status(201).json({ success: true, data: result });
  }
);

export const login = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.json({ success: true, data: result });
  }
);

export const me = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    res.json({
      success: true,
      data: req.user,
    });
  }
);
