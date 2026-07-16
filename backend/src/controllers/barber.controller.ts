import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { PrismaClient } from '@prisma/client';
import { createBarberSchema, updateBarberSchema } from '../schemas/barber.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { NotFound } from '../utils/errors.js';
import ReviewService from '../services/review.service.js';

const prisma = new PrismaClient();

export const getBarbersWithServices = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await prisma.barber.findMany({
      where: { isActive: true },
      include: {
        services: {
          include: { service: true },
        },
        reviews: {
          where: { isDeleted: false },
          select: { id: true },
        },
      },
    });

    // Enriquecer con datos de ratings
    const enrichedResult = await Promise.all(
      result.map(async (barber) => {
        const ratingData = await ReviewService.calculateBarberRating(barber.id);
        return {
          ...barber,
          reviewCount: barber.reviews.length,
          averageRating: ratingData.average,
          ratingDistribution: ratingData.distribution,
          reviews: undefined, // Remover el array de reviews completo
        };
      })
    );

    res.json({ success: true, data: enrichedResult });
  }
);

export const getBarber = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await prisma.barber.findUnique({
      where: { id },
      include: {
        services: {
          include: { service: true },
        },
        schedules: true,
        reviews: {
          where: { isDeleted: false },
          select: { id: true },
        },
      },
    });

    if (!result) {
      throw new NotFound('Barber not found');
    }

    // Enriquecer con datos de ratings
    const ratingData = await ReviewService.calculateBarberRating(id);
    const enrichedResult = {
      ...result,
      reviewCount: result.reviews.length,
      averageRating: ratingData.average,
      ratingDistribution: ratingData.distribution,
      reviews: undefined, // Remover el array de reviews completo
    };

    res.json({ success: true, data: enrichedResult });
  }
);

export const createBarber = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const input = createBarberSchema.parse(req.body);
    const result = await prisma.barber.create({
      data: {
        ...input,
        user: {
          create: {
            email: input.email,
            password: 'temp-password', // Should be handled properly
            role: 'BARBER',
          },
        },
      },
      include: { services: true, schedules: true },
    });
    res.status(201).json({ success: true, data: result });
  }
);

export const updateBarber = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const input = updateBarberSchema.parse(req.body);
    const result = await prisma.barber.update({
      where: { id },
      data: input,
      include: { services: true, schedules: true },
    });
    res.json({ success: true, data: result });
  }
);

export const deleteBarber = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    await prisma.barber.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Barber deleted successfully' });
  }
);
