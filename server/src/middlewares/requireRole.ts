import type { RequestHandler } from 'express';
import type { UserRole } from '../models/user.model.js';

export const requireRole = (...roles: UserRole[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({ message: 'Forbidden' });
    }

    next();
  };
};
