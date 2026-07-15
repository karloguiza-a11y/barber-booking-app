import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { PrismaClient } from '@prisma/client';
import { createServiceSchema, updateServiceSchema } from '../schemas/service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { NotFound } from '../utils/errors.js';

const prisma = new PrismaClient();

export const createService = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const input = createServiceSchema.parse(req.body);
    const result = await prisma.service.create({
      data: input,
    });
    res.status(201).json({ success: true, data: result });
  }
);

export const getServices = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await prisma.service.findMany({
      where: { isActive: true },
    });
    res.json({ success: true, data: result });
  }
);

export const getService = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await prisma.service.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFound('Service not found');
    }

    res.json({ success: true, data: result });
  }
);

export const updateService = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const input = updateServiceSchema.parse(req.body);
    const result = await prisma.service.update({
      where: { id },
      data: input,
    });
    res.json({ success: true, data: result });
  }
);

export const deleteService = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    await prisma.service.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Service deleted successfully' });
  }
);
