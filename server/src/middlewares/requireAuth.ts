import type { RequestHandler } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';

export const requireAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authorization.slice('Bearer '.length);

  let payload: string | JwtPayload;

  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (typeof payload === 'string') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findById(payload.sub);

  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = { id: user.id, role: user.role };

  next();
};
