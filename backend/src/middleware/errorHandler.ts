import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors.js';
import { config } from '../config/env.js';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error('[Error]', error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.errors,
    });
  }

  if (config.server.env === 'development') {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

import { z } from 'zod';
