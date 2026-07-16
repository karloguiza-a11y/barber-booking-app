import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { ReservationService } from '../services/reservation.service.js';
import { SMSService } from '../services/sms.service.js';
import { createReservationSchema, updateReservationSchema } from '../schemas/reservation.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const reservationService = new ReservationService();
const smsService = new SMSService();

export const createReservation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const input = createReservationSchema.parse(req.body);
    const result = await reservationService.createReservation(req.user!.id, input);

    // Send SMS confirmation (non-blocking, don't fail if SMS fails)
    if (req.user && result.client) {
      const reservationData = {
        id: result.id,
        clientName: `${result.client.firstName} ${result.client.lastName}`,
        clientPhone: result.client.phone,
        barberName: `${result.barber.firstName} ${result.barber.lastName}`,
        serviceName: result.service.name,
        appointmentDate: result.appointmentDate,
        startTime: result.startTime,
      };

      smsService.sendReservationConfirmation(result.client.phone, reservationData).catch((error) => {
        console.warn('Failed to send SMS confirmation:', error);
      });
    }

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

    // Send SMS cancellation notification (non-blocking)
    if (result.client) {
      const reservationData = {
        id: result.id,
        clientName: `${result.client.firstName} ${result.client.lastName}`,
        clientPhone: result.client.phone,
        barberName: `${result.barber.firstName} ${result.barber.lastName}`,
        serviceName: result.service.name,
        appointmentDate: result.appointmentDate,
        startTime: result.startTime,
      };

      smsService.sendReservationCancellation(result.client.phone, reservationData).catch((error) => {
        console.warn('Failed to send SMS cancellation:', error);
      });
    }

    res.json({ success: true, data: result });
  }
);

export const getMyReservations = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await reservationService.getClientReservations(req.user!.id);
    res.json({ success: true, data: result });
  }
);
