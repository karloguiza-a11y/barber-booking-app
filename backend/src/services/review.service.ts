import { PrismaClient, ReservationStatus } from '@prisma/client';
import { NotFound, BadRequest, Unauthorized, Forbidden } from '../utils/errors.js';
import {
  validateReviewInput,
  validateReviewTitle,
  validateReviewComment,
  validateReviewImages,
} from '../utils/review-validation.js';

const prisma = new PrismaClient();

export interface CreateReviewInput {
  reservationId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface ReviewResponse {
  id: string;
  reservationId: string;
  barberId: string;
  clientId: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  images: string[];
  helpful: number;
  unhelpful: number;
  isVerified: boolean;
  reportReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ReviewService {
  /**
   * Crear una nueva reseña
   * Solo después de que la reserva esté completada
   */
  async createReview(clientId: string, input: CreateReviewInput): Promise<ReviewResponse> {
    // Validaciones
    await validateReviewInput(input);

    // Obtener la reserva
    const reservation = await prisma.reservation.findUnique({
      where: { id: input.reservationId },
      include: { client: true, barber: true, service: true },
    });

    if (!reservation) {
      throw new NotFound('Reservation not found');
    }

    // Verificar que la reserva pertenece al cliente
    if (reservation.clientId !== clientId) {
      throw new Forbidden('You can only review your own reservations');
    }

    // Verificar que la reserva esté completada
    if (reservation.status !== ReservationStatus.COMPLETED) {
      throw new BadRequest('Review can only be created for completed reservations');
    }

    // Verificar que han pasado al menos 24 horas desde la completación
    const completedTime = new Date(reservation.appointmentDate);
    const now = new Date();
    const hoursDifference = (now.getTime() - completedTime.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 0) {
      throw new BadRequest('Appointment has not yet been completed');
    }

    // Verificar que no exista una reseña ya para esta reserva
    const existingReview = await prisma.review.findUnique({
      where: { reservationId: input.reservationId },
    });

    if (existingReview) {
      throw new BadRequest('Review already exists for this reservation');
    }

    // Crear la reseña
    const review = await prisma.review.create({
      data: {
        reservationId: input.reservationId,
        barberId: reservation.barberId,
        clientId,
        rating: input.rating,
        title: input.title || null,
        comment: input.comment || null,
        images: input.images || [],
        isVerified: true, // Verificado porque viene de una reserva completada
      },
    });

    return this.formatReview(review);
  }

  /**
   * Actualizar una reseña existente
   * Solo el creador puede actualizar
   */
  async updateReview(
    reviewId: string,
    clientId: string,
    input: UpdateReviewInput,
  ): Promise<ReviewResponse> {
    // Obtener la reseña
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFound('Review not found');
    }

    // Verificar que el cliente es el propietario
    if (review.clientId !== clientId) {
      throw new Forbidden('You can only update your own reviews');
    }

    // Validaciones de entrada
    if (input.rating !== undefined) {
      if (input.rating < 1 || input.rating > 5) {
        throw new BadRequest('Rating must be between 1 and 5');
      }
    }

    if (input.title !== undefined && input.title !== null) {
      validateReviewTitle(input.title);
    }

    if (input.comment !== undefined && input.comment !== null) {
      validateReviewComment(input.comment);
    }

    if (input.images !== undefined) {
      validateReviewImages(input.images);
    }

    // Actualizar
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: input.rating ?? review.rating,
        title: input.title !== undefined ? input.title : review.title,
        comment: input.comment !== undefined ? input.comment : review.comment,
        images: input.images ?? review.images,
      },
    });

    return this.formatReview(updatedReview);
  }

  /**
   * Eliminar una reseña (soft delete)
   * Solo el creador o admin pueden eliminar
   */
  async deleteReview(reviewId: string, clientId: string): Promise<void> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFound('Review not found');
    }

    if (review.clientId !== clientId) {
      throw new Forbidden('You can only delete your own reviews');
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: { isDeleted: true },
    });
  }

  /**
   * Obtener todas las reseñas de un barbero con paginación
   */
  async getReviewsByBarber(
    barberId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: 'recent' | 'helpful' | 'rating' = 'recent',
  ): Promise<{
    reviews: ReviewResponse[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    // Determinar orden
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'helpful') {
      orderBy = { helpful: 'desc' };
    } else if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          barberId,
          isDeleted: false,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: {
          barberId,
          isDeleted: false,
        },
      }),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      reviews: reviews.map((r) => this.formatReview(r)),
      total,
      page,
      pages,
    };
  }

  /**
   * Obtener todas las reseñas de un cliente
   */
  async getReviewsByClient(clientId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          clientId,
          isDeleted: false,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: {
          clientId,
          isDeleted: false,
        },
      }),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      reviews: reviews.map((r) => this.formatReview(r)),
      total,
      page,
      pages,
    };
  }

  /**
   * Obtener reseña de una reserva específica
   */
  async getReviewForReservation(reservationId: string): Promise<ReviewResponse | null> {
    const review = await prisma.review.findUnique({
      where: { reservationId },
    });

    return review ? this.formatReview(review) : null;
  }

  /**
   * Obtener una reseña por ID
   */
  async getReview(reviewId: string): Promise<ReviewResponse> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFound('Review not found');
    }

    return this.formatReview(review);
  }

  /**
   * Calcular rating promedio de un barbero
   */
  async calculateBarberRating(barberId: string): Promise<{
    average: number;
    total: number;
    distribution: Record<number, number>;
  }> {
    const reviews = await prisma.review.findMany({
      where: {
        barberId,
        isDeleted: false,
      },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / total;

    // Distribución de ratings
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      distribution[r.rating]++;
    });

    return {
      average: Math.round(average * 10) / 10,
      total,
      distribution,
    };
  }

  /**
   * Actualizar el rating del barbero en la base de datos
   */
  async updateBarberRating(barberId: string): Promise<void> {
    const { average } = await this.calculateBarberRating(barberId);

    await prisma.barber.update({
      where: { id: barberId },
      data: { rating: average },
    });
  }

  /**
   * Calcular rating promedio de un servicio
   */
  async calculateServiceRating(serviceId: string): Promise<{
    average: number;
    total: number;
  }> {
    const reviews = await prisma.review.findMany({
      where: {
        isDeleted: false,
        reservation: {
          serviceId,
        },
      },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return { average: 0, total: 0 };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / total;

    return {
      average: Math.round(average * 10) / 10,
      total,
    };
  }

  /**
   * Marcar una reseña como útil
   */
  async markHelpful(reviewId: string): Promise<ReviewResponse> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFound('Review not found');
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { helpful: review.helpful + 1 },
    });

    return this.formatReview(updated);
  }

  /**
   * Marcar una reseña como no útil
   */
  async markUnhelpful(reviewId: string): Promise<ReviewResponse> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFound('Review not found');
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { unhelpful: review.unhelpful + 1 },
    });

    return this.formatReview(updated);
  }

  /**
   * Reportar una reseña como inapropiada
   */
  async reportReview(reviewId: string, reason: string): Promise<void> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFound('Review not found');
    }

    // Validar razón
    if (!reason || reason.length < 5 || reason.length > 500) {
      throw new BadRequest('Report reason must be between 5 and 500 characters');
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: { reportReason: reason },
    });
  }

  /**
   * Obtener todas las reseñas reportadas (solo admin)
   */
  async getReportedReviews(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          reportReason: { not: null },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          client: { select: { firstName: true, lastName: true, email: true } },
          barber: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.review.count({
        where: {
          reportReason: { not: null },
        },
      }),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      reviews,
      total,
      page,
      pages,
    };
  }

  /**
   * Eliminar una reseña reportada (admin)
   */
  async deleteReportedReview(reviewId: string): Promise<void> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFound('Review not found');
    }

    if (!review.reportReason) {
      throw new BadRequest('This review has not been reported');
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: { isDeleted: true },
    });
  }

  /**
   * Formatear respuesta de reseña
   */
  private formatReview(review: any): ReviewResponse {
    return {
      id: review.id,
      reservationId: review.reservationId,
      barberId: review.barberId,
      clientId: review.clientId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images || [],
      helpful: review.helpful,
      unhelpful: review.unhelpful,
      isVerified: review.isVerified,
      reportReason: review.reportReason,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}

export default new ReviewService();
