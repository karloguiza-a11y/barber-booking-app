import { PrismaClient, ReservationStatus } from '@prisma/client';
import { NotFound, BadRequest } from '../utils/errors.js';
import { CreateReservationInput, UpdateReservationInput } from '../schemas/reservation.js';
import { isTimeSlotAvailable, addMinutesToTime } from '../utils/helpers.js';
import { NotificationService } from './notification.service.js';

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
    const reservation = await this.updateReservation(id, {
      status: ReservationStatus.CANCELLED,
    });

    // Send cancellation email
    await this.notificationService.sendCancellationNotification(reservation);

    return reservation;
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
}
