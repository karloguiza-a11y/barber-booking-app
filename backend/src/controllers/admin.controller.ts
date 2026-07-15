import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { PrismaClient, ReservationStatus } from '@prisma/client';
import { asyncHandler } from '../middleware/asyncHandler.js';

const prisma = new PrismaClient();

export const getDashboardStats = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const [totalReservations, todayReservations, upcomingReservations, totalClients, totalRevenue] =
      await Promise.all([
        prisma.reservation.count(),
        prisma.reservation.count({
          where: {
            appointmentDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        }),
        prisma.reservation.count({
          where: {
            appointmentDate: { gte: new Date() },
            status: { not: ReservationStatus.CANCELLED },
          },
        }),
        prisma.client.count(),
        prisma.reservation.aggregate({
          _sum: { totalPrice: true },
        }),
      ]);

    res.json({
      success: true,
      data: {
        totalReservations,
        todayReservations,
        upcomingReservations,
        totalClients,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
      },
    });
  }
);

export const getReservationsForCalendar = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { startDate, endDate, barberId } = req.query;

    const reservations = await prisma.reservation.findMany({
      where: {
        ...(barberId && { barberId: barberId as string }),
        appointmentDate: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
        status: { not: ReservationStatus.CANCELLED },
      },
      include: {
        client: true,
        barber: true,
        service: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });

    res.json({ success: true, data: reservations });
  }
);

export const getClients = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { search } = req.query;

    const clients = await prisma.client.findMany({
      ...(search && {
        where: {
          OR: [
            { firstName: { contains: search as string, mode: 'insensitive' } },
            { lastName: { contains: search as string, mode: 'insensitive' } },
            { email: { contains: search as string, mode: 'insensitive' } },
          ],
        },
      }),
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    });

    res.json({ success: true, data: clients });
  }
);

export const getClientDetails = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        reservations: {
          include: {
            barber: true,
            service: true,
            referenceImages: true,
          },
          orderBy: { appointmentDate: 'desc' },
        },
      },
    });

    res.json({ success: true, data: client });
  }
);
