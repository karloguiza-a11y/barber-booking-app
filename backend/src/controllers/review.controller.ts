import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import ReviewService, { CreateReviewInput, UpdateReviewInput } from '../services/review.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateReportReason } from '../utils/review-validation.js';

/**
 * POST /api/reviews
 * Crear una nueva reseña
 */
export const createReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const input: CreateReviewInput = {
    reservationId: req.body.reservationId,
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment,
    images: req.body.images,
  };

  const result = await ReviewService.createReview(req.user!.id, input);

  // Actualizar rating del barbero
  await ReviewService.updateBarberRating(result.barberId);

  res.status(201).json({ success: true, data: result });
});

/**
 * PATCH /api/reviews/:id
 * Actualizar una reseña existente
 */
export const updateReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const input: UpdateReviewInput = {
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment,
    images: req.body.images,
  };

  const result = await ReviewService.updateReview(id, req.user!.id, input);

  // Actualizar rating del barbero
  const review = await ReviewService.getReview(id);
  await ReviewService.updateBarberRating(review.barberId);

  res.json({ success: true, data: result });
});

/**
 * DELETE /api/reviews/:id
 * Eliminar una reseña (soft delete)
 */
export const deleteReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const review = await ReviewService.getReview(id);
  await ReviewService.deleteReview(id, req.user!.id);

  // Actualizar rating del barbero
  await ReviewService.updateBarberRating(review.barberId);

  res.json({ success: true, message: 'Review deleted successfully' });
});

/**
 * GET /api/reviews/barber/:barberId
 * Obtener todas las reseñas de un barbero
 */
export const getReviewsByBarber = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { barberId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as 'recent' | 'helpful' | 'rating') || 'recent';

    const result = await ReviewService.getReviewsByBarber(barberId, page, limit, sortBy);

    res.json({
      success: true,
      data: result.reviews,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit,
      },
    });
  }
);

/**
 * GET /api/reviews/client/:clientId
 * Obtener mis reseñas
 */
export const getMyReviews = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await ReviewService.getReviewsByClient(req.user!.id, page, limit);

  res.json({
    success: true,
    data: result.reviews,
    pagination: {
      total: result.total,
      page: result.page,
      pages: result.pages,
      limit,
    },
  });
});

/**
 * GET /api/reviews/:id
 * Obtener una reseña específica
 */
export const getReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.getReview(id);

  res.json({ success: true, data: result });
});

/**
 * POST /api/reviews/:id/helpful
 * Marcar una reseña como útil
 */
export const markReviewHelpful = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await ReviewService.markHelpful(id);

    res.json({ success: true, data: result });
  }
);

/**
 * POST /api/reviews/:id/unhelpful
 * Marcar una reseña como no útil
 */
export const markReviewUnhelpful = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await ReviewService.markUnhelpful(id);

    res.json({ success: true, data: result });
  }
);

/**
 * POST /api/reviews/:id/report
 * Reportar una reseña como inapropiada
 */
export const reportReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  validateReportReason(reason);

  await ReviewService.reportReview(id, reason);

  res.json({ success: true, message: 'Review reported successfully' });
});

/**
 * GET /api/reviews/reported
 * Obtener todas las reseñas reportadas (Admin)
 */
export const getReportedReviews = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await ReviewService.getReportedReviews(page, limit);

    res.json({
      success: true,
      data: result.reviews,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit,
      },
    });
  }
);

/**
 * DELETE /api/reviews/:id/reported
 * Eliminar una reseña reportada (Admin)
 */
export const deleteReportedReview = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const review = await ReviewService.getReview(id);
    await ReviewService.deleteReportedReview(id);

    // Actualizar rating del barbero
    await ReviewService.updateBarberRating(review.barberId);

    res.json({ success: true, message: 'Reported review deleted successfully' });
  }
);

/**
 * GET /api/barber/:barberId/rating
 * Obtener rating promedio de un barbero
 */
export const getBarberRating = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { barberId } = req.params;

    const result = await ReviewService.calculateBarberRating(barberId);

    res.json({
      success: true,
      data: {
        barberId,
        ...result,
      },
    });
  }
);

/**
 * GET /api/service/:serviceId/rating
 * Obtener rating promedio de un servicio
 */
export const getServiceRating = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { serviceId } = req.params;

    const result = await ReviewService.calculateServiceRating(serviceId);

    res.json({
      success: true,
      data: {
        serviceId,
        ...result,
      },
    });
  }
);

/**
 * GET /api/reviews/reservation/:reservationId
 * Obtener reseña de una reserva específica
 */
export const getReviewForReservation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { reservationId } = req.params;

    const result = await ReviewService.getReviewForReservation(reservationId);

    if (!result) {
      return res.json({
        success: true,
        data: null,
        message: 'No review found for this reservation',
      });
    }

    res.json({ success: true, data: result });
  }
);
