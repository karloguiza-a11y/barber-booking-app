import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { ReservationService } from '../services/reservation.service.js';
import { createReservationSchema, updateReservationSchema } from '../schemas/reservation.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const reservationService = new ReservationService();

export const createReservation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const input = createReservationSchema.parse(req.body);
    const result = await reservationService.createReservation(req.user!.id, input);
    res.status(201).json({ success: true, data: result });
  }
);

export const getReservation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await reservationService.getReservation(id);
    res.json({ success: true, data: result });
  }
);

export const updateReservation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const input = updateReservationSchema.parse(req.body);
    const result = await reservationService.updateReservation(id, input);
    res.json({ success: true, data: result });
  }
);

export const cancelReservation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await reservationService.cancelReservation(id);
    res.json({ success: true, data: result });
  }
);

export const getMyReservations = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await reservationService.getClientReservations(req.user!.id);
    res.json({ success: true, data: result });
  }
);
