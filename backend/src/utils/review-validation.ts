import { BadRequest } from './errors.js';

/**
 * Validaciones para el sistema de reseñas
 */

const RATING_MIN = 1;
const RATING_MAX = 5;
const TITLE_MAX_LENGTH = 200;
const COMMENT_MAX_LENGTH = 1000;
const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE_MB = 20;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

/**
 * Validar entrada completa de reseña
 */
export function validateReviewInput(input: any): void {
  // Rating
  if (input.rating === undefined) {
    throw new BadRequest('Rating is required');
  }

  if (!Number.isInteger(input.rating) || input.rating < RATING_MIN || input.rating > RATING_MAX) {
    throw new BadRequest(`Rating must be an integer between ${RATING_MIN} and ${RATING_MAX}`);
  }

  // Title (opcional)
  if (input.title !== undefined && input.title !== null) {
    validateReviewTitle(input.title);
  }

  // Comment (opcional)
  if (input.comment !== undefined && input.comment !== null) {
    validateReviewComment(input.comment);
  }

  // Images (opcional)
  if (input.images !== undefined && input.images !== null) {
    validateReviewImages(input.images);
  }
}

/**
 * Validar título de reseña
 */
export function validateReviewTitle(title: string): void {
  if (typeof title !== 'string') {
    throw new BadRequest('Title must be a string');
  }

  if (title.trim().length === 0) {
    throw new BadRequest('Title cannot be empty');
  }

  if (title.length > TITLE_MAX_LENGTH) {
    throw new BadRequest(`Title must not exceed ${TITLE_MAX_LENGTH} characters`);
  }
}

/**
 * Validar comentario de reseña
 */
export function validateReviewComment(comment: string): void {
  if (typeof comment !== 'string') {
    throw new BadRequest('Comment must be a string');
  }

  if (comment.trim().length === 0) {
    throw new BadRequest('Comment cannot be empty');
  }

  if (comment.length > COMMENT_MAX_LENGTH) {
    throw new BadRequest(`Comment must not exceed ${COMMENT_MAX_LENGTH} characters`);
  }
}

/**
 * Validar imágenes de reseña
 */
export function validateReviewImages(images: any[]): void {
  if (!Array.isArray(images)) {
    throw new BadRequest('Images must be an array');
  }

  if (images.length > MAX_IMAGES) {
    throw new BadRequest(`Maximum ${MAX_IMAGES} images allowed per review`);
  }

  images.forEach((image, index) => {
    if (typeof image !== 'string') {
      throw new BadRequest(`Image ${index + 1} must be a string URL`);
    }

    // Validar que sea una URL válida
    try {
      new URL(image);
    } catch {
      throw new BadRequest(`Image ${index + 1} is not a valid URL`);
    }

    // Validar extensiones permitidas (basado en URL)
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExtension = allowedExtensions.some((ext) =>
      image.toLowerCase().includes(ext),
    );

    if (!hasValidExtension) {
      throw new BadRequest(
        `Image ${index + 1} must be a valid image format (jpg, jpeg, png, gif, webp)`,
      );
    }
  });
}

/**
 * Validar razón de reporte
 */
export function validateReportReason(reason: string): void {
  if (typeof reason !== 'string') {
    throw new BadRequest('Report reason must be a string');
  }

  if (reason.trim().length < 5) {
    throw new BadRequest('Report reason must be at least 5 characters');
  }

  if (reason.length > 500) {
    throw new BadRequest('Report reason must not exceed 500 characters');
  }
}

/**
 * Validar rating
 */
export function validateRating(rating: any): void {
  if (!Number.isInteger(rating) || rating < RATING_MIN || rating > RATING_MAX) {
    throw new BadRequest(`Rating must be an integer between ${RATING_MIN} and ${RATING_MAX}`);
  }
}

export const REVIEW_CONSTANTS = {
  RATING_MIN,
  RATING_MAX,
  TITLE_MAX_LENGTH,
  COMMENT_MAX_LENGTH,
  MAX_IMAGES,
  MAX_IMAGE_SIZE_MB,
  MAX_IMAGE_SIZE_BYTES,
};
