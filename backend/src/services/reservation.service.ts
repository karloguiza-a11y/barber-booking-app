import { PrismaClient, ReservationStatus } from '@prisma/client';
import { NotFound, BadRequest } from '../utils/errors.js';
import { CreateReservationInput, UpdateReservationInput } from '../schemas/reservation.js';
import { isTimeSlotAvailable, addMinutesToTime } from '../utils/helpers.js';
import { NotificationService } from './notification.service.js';
import PaymentService from './payment.service.js';

const prisma = new PrismaClient();

export class ReservationService {
  private notificationService = new NotificationService();

  async createReservation(clientId: string, input: CreateReservationInput) {
    const service = await prisma.service.findUnique({
      where: { id: input.serviceId },
    });

    if (!service) {
      throw new NotFound('Service not found');
    }

    const barber = await prisma.barber.findUnique({
      where: { id: input.barberId },
    });

    if (!barber) {
      throw new NotFound('Barber not found');
    }

    // Calculate end time
    const endTime = addMinutesToTime(input.startTime, service.duration);

    // Check availability
    const existingReservations = await prisma.reservation.findMany({
      where: {
        barberId: input.barberId,
        appointmentDate: new Date(input.appointmentDate),
        status: { not: ReservationStatus.CANCELLED },
      },
    });

    const isAvailable = isTimeSlotAvailable(input.startTime, endTime, existingReservations);

    if (!isAvailable) {
      throw new BadRequest('Time slot is not available');
    }

    const reservation = await prisma.reservation.create({
      data: {
        clientId,
        barberId: input.barberId,
        serviceId: input.serviceId,
        appointmentDate: new Date(input.appointmentDate),
        startTime: input.startTime,
        endTime,
        totalPrice: service.price,
        notes: input.notes,
        status: ReservationStatus.PENDING,
      },
      include: {
        client: true,
        barber: true,
        service: true,
      },
    });

    // Send confirmation email
    await this.notificationService.sendReservationConfirmation(reservation);

    return reservation;
  }

  async getReservation(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        client: true,
        barber: true,
        service: true,
        referenceImages: true,
      },
    });

    if (!reservation) {
      throw new NotFound('Reservation not found');
    }

    return reservation;
  }

  async updateReservation(id: string, input: UpdateReservationInput) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFound('Reservation not found');
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: input,
      include: {
        client: true,
        barber: true,
        service: true,
      },
    });

    return updated;
  }

  async cancelReservation(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!reservation) {
      throw new NotFound('Reservation not found');
    }

    const updated = await this.updateReservation(id, {
      status: ReservationStatus.CANCELLED,
    });

    // Handle payment refund if payment exists and is completed
    if (reservation.payments && reservation.payments.length > 0) {
      const completedPayment = reservation.payments.find((p) => p.status === 'COMPLETED');
      if (completedPayment) {
        try {
          await PaymentService.refundPayment(completedPayment.id, 'reservation_cancelled');
        } catch (error) {
          console.error('Failed to refund payment on cancellation:', error);
          // Don't throw - the cancellation should succeed even if refund fails
        }
      }
    }

    // Send cancellation email
    await this.notificationService.sendCancellationNotification(updated);

    return updated;
  }

  async getClientReservations(clientId: string) {
    return prisma.reservation.findMany({
      where: { clientId },
      include: {
        barber: true,
        service: true,
        referenceImages: true,
      },
      orderBy: { appointmentDate: 'desc' },
    });
  }

  async getBarberReservations(barberId: string, startDate?: Date, endDate?: Date) {
    return prisma.reservation.findMany({
      where: {
        barberId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        client: true,
        service: true,
        referenceImages: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async completeReservation(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFound('Reservation not found');
    }

    if (reservation.status === ReservationStatus.COMPLETED) {
      throw new BadRequest('Reservation is already completed');
    }

    const updated = await this.updateReservation(id, {
      status: ReservationStatus.COMPLETED,
    });

    // Send completion notification
    await this.notificationService.sendCompletionNotification(updated);

    return updated;
  }

  async markNoShow(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFound('Reservation not found');
    }

    const updated = await this.updateReservation(id, {
      status: ReservationStatus.NO_SHOW,
    });

    return updated;
  }
}
