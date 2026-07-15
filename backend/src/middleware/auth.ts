import { Request, Response, NextFunction } from 'express';
import { Unauthorized, Forbidden } from '../utils/errors.js';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { AuthenticatedRequest, JwtPayload } from '../types/index.js';
import { UserRole } from '@prisma/client';

export const authMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    throw new Unauthorized('No token provided');
  }

  const payload = verifyToken(token);
  req.user = payload;
  next();
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new Unauthorized();
    }

    if (!roles.includes(req.user.role)) {
      throw new Forbidden('You do not have permission to access this resource');
    }

    next();
  };
};
