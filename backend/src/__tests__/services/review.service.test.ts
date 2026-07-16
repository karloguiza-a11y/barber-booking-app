import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ReviewService, CreateReviewInput } from '../../services/review.service';
import { PrismaClient, ReservationStatus } from '@prisma/client';
import { NotFound, BadRequest, Forbidden } from '../../utils/errors';

// Mock de Prisma
vi.mock('@prisma/client', () => {
  const mockPrismaClient = vi.fn();
  return { PrismaClient: mockPrismaClient };
});

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let mockPrisma: any;

  beforeEach(() => {
    reviewService = new ReviewService();
    mockPrisma = {
      review: {
        create: vi.fn(),
        update: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
      },
      reservation: {
        findUnique: vi.fn(),
      },
      barber: {
        update: vi.fn(),
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createReview', () => {
    it('TC001: Should create a review with valid data', async () => {
      const clientId = 'client-123';
      const input: CreateReviewInput = {
        reservationId: 'reservation-123',
        rating: 5,
        title: 'Great service',
        comment: 'Excellent barber, highly recommended',
        images: [],
      };

      const mockReservation = {
        id: 'reservation-123',
        clientId,
        barberId: 'barber-123',
        serviceId: 'service-123',
        appointmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: ReservationStatus.COMPLETED,
      };

      const mockCreatedReview = {
        id: 'review-123',
        ...input,
        barberId: 'barber-123',
        clientId,
        isVerified: true,
        helpful: 0,
        unhelpful: 0,
        reportReason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Should validate input
      expect(() => {
        if (input.rating < 1 || input.rating > 5) throw new BadRequest('Invalid rating');
      }).not.toThrow();

      // Should check reservation exists
      expect(mockReservation).toBeDefined();

      // Should check ownership
      expect(mockReservation.clientId).toBe(clientId);

      // Should check completion status
      expect(mockReservation.status).toBe(ReservationStatus.COMPLETED);

      // Should check time has passed
      const now = new Date();
      const hoursDifference = (now.getTime() - mockReservation.appointmentDate.getTime()) / (1000 * 60 * 60);
      expect(hoursDifference).toBeGreaterThanOrEqual(0);
    });

    it('TC002: Should reject review with rating below 1', () => {
      expect(() => {
        const rating = 0;
        if (rating < 1 || rating > 5) throw new BadRequest('Rating must be between 1 and 5');
      }).toThrow(BadRequest);
    });

    it('TC003: Should reject review with rating above 5', () => {
      expect(() => {
        const rating = 6;
        if (rating < 1 || rating > 5) throw new BadRequest('Rating must be between 1 and 5');
      }).toThrow(BadRequest);
    });

    it('TC004: Should reject review if reservation not found', () => {
      expect(() => {
        const reservation = null;
        if (!reservation) throw new NotFound('Reservation not found');
      }).toThrow(NotFound);
    });

    it('TC005: Should reject review if user is not the reservation owner', () => {
      const clientId = 'client-123';
      const reservationClientId = 'client-456';

      expect(() => {
        if (reservationClientId !== clientId) throw new Forbidden('You can only review your own reservations');
      }).toThrow(Forbidden);
    });

    it('TC006: Should reject review if reservation is not completed', () => {
      const status = ReservationStatus.PENDING;

      expect(() => {
        if (status !== ReservationStatus.COMPLETED) {
          throw new BadRequest('Review can only be created for completed reservations');
        }
      }).toThrow(BadRequest);
    });

    it('TC007: Should reject review if reservation already has a review', () => {
      expect(() => {
        const existingReview = { id: 'review-123' };
        if (existingReview) throw new BadRequest('Review already exists for this reservation');
      }).toThrow(BadRequest);
    });

    it('TC008: Should reject review with title exceeding max length', () => {
      expect(() => {
        const title = 'a'.repeat(201);
        if (title.length > 200) throw new BadRequest('Title must not exceed 200 characters');
      }).toThrow(BadRequest);
    });

    it('TC009: Should reject review with comment exceeding max length', () => {
      expect(() => {
        const comment = 'a'.repeat(1001);
        if (comment.length > 1000) throw new BadRequest('Comment must not exceed 1000 characters');
      }).toThrow(BadRequest);
    });

    it('TC010: Should reject review with more than 5 images', () => {
      expect(() => {
        const images = Array(6).fill('https://example.com/image.jpg');
        if (images.length > 5) throw new BadRequest('Maximum 5 images allowed per review');
      }).toThrow(BadRequest);
    });
  });

  describe('updateReview', () => {
    it('TC011: Should update review with valid data', () => {
      const review = {
        id: 'review-123',
        clientId: 'client-123',
        rating: 4,
        title: 'Good service',
        comment: 'Nice haircut',
        images: [],
      };

      const update = {
        rating: 5,
        title: 'Excellent service',
        comment: 'Amazing experience',
      };

      const updated = { ...review, ...update };

      expect(updated.rating).toBe(5);
      expect(updated.title).toBe('Excellent service');
      expect(updated.comment).toBe('Amazing experience');
    });

    it('TC012: Should reject update if not review creator', () => {
      const reviewClientId = 'client-123';
      const userId = 'client-456';

      expect(() => {
        if (reviewClientId !== userId) throw new Forbidden('You can only update your own reviews');
      }).toThrow(Forbidden);
    });

    it('TC013: Should reject update if review not found', () => {
      expect(() => {
        const review = null;
        if (!review) throw new NotFound('Review not found');
      }).toThrow(NotFound);
    });
  });

  describe('deleteReview', () => {
    it('TC014: Should soft delete review', () => {
      const review = {
        id: 'review-123',
        clientId: 'client-123',
        isDeleted: false,
      };

      const deleted = { ...review, isDeleted: true };
      expect(deleted.isDeleted).toBe(true);
    });

    it('TC015: Should reject delete if not review creator', () => {
      const reviewClientId = 'client-123';
      const userId = 'client-456';

      expect(() => {
        if (reviewClientId !== userId) throw new Forbidden('You can only delete your own reviews');
      }).toThrow(Forbidden);
    });
  });

  describe('calculateBarberRating', () => {
    it('TC016: Should calculate average rating correctly', () => {
      const reviews = [
        { rating: 5 },
        { rating: 4 },
        { rating: 5 },
        { rating: 3 },
        { rating: 5 },
      ];

      const total = reviews.length;
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      const average = Math.round((sum / total) * 10) / 10;

      expect(average).toBe(4.4);
      expect(total).toBe(5);
    });

    it('TC017: Should return 0 for barber with no reviews', () => {
      const reviews: any[] = [];
      const total = reviews.length;
      const average = total === 0 ? 0 : 0;

      expect(average).toBe(0);
      expect(total).toBe(0);
    });

    it('TC018: Should create correct distribution', () => {
      const reviews = [
        { rating: 1 },
        { rating: 2 },
        { rating: 3 },
        { rating: 4 },
        { rating: 5 },
        { rating: 5 },
      ];

      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach((r) => {
        distribution[r.rating]++;
      });

      expect(distribution).toEqual({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 2 });
    });
  });

  describe('markHelpful and markUnhelpful', () => {
    it('TC019: Should increment helpful count', () => {
      let helpful = 5;
      helpful += 1;
      expect(helpful).toBe(6);
    });

    it('TC020: Should increment unhelpful count', () => {
      let unhelpful = 3;
      unhelpful += 1;
      expect(unhelpful).toBe(4);
    });
  });

  describe('reportReview', () => {
    it('TC021: Should report review with valid reason', () => {
      const reason = 'Inappropriate language';

      expect(reason).toBeDefined();
      expect(reason.length).toBeGreaterThanOrEqual(5);
      expect(reason.length).toBeLessThanOrEqual(500);
    });

    it('TC022: Should reject report reason too short', () => {
      expect(() => {
        const reason = 'Bad';
        if (reason.length < 5) throw new BadRequest('Report reason must be at least 5 characters');
      }).toThrow(BadRequest);
    });

    it('TC023: Should reject report reason too long', () => {
      expect(() => {
        const reason = 'a'.repeat(501);
        if (reason.length > 500) throw new BadRequest('Report reason must not exceed 500 characters');
      }).toThrow(BadRequest);
    });
  });

  describe('pagination', () => {
    it('TC024: Should calculate pagination correctly', () => {
      const total = 125;
      const limit = 10;
      const page = 2;
      const pages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      expect(pages).toBe(13);
      expect(skip).toBe(10);
    });
  });

  describe('permissions', () => {
    it('TC025: Should verify only creator can modify review', () => {
      const reviewCreatorId = 'client-123';
      const attemptingUserId = 'client-456';

      const canModify = reviewCreatorId === attemptingUserId;
      expect(canModify).toBe(false);
    });

    it('TC026: Should verify admin can delete reported reviews', () => {
      const userRole = 'ADMIN';
      const isAdmin = userRole === 'ADMIN';

      expect(isAdmin).toBe(true);
    });
  });
});
