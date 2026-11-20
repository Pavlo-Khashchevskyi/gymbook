import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { requireRole } from '../middlewares/requireRole.js';
import { Invite, INVITE_ROLES } from '../models/invite.model.js';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { validate } from '../middlewares/validate.js';

export const invitesRouter = Router();
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

invitesRouter.get(
  '/',
  requireAuth,
  requireRole('trainer', 'admin'),
  async (req, res) => {
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const invites = await Invite.find({ createdBy: user.id }).sort({
      createdAt: -1,
    });

    return res.json(invites);
  },
);

const createInviteSchema = z.object({
  role: z.enum(INVITE_ROLES),
});

invitesRouter.post(
  '/',
  requireAuth,
  requireRole('trainer', 'admin'),
  validate(createInviteSchema),
  async (req, res) => {
    const { user } = req;
    const { role } = req.body;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.role === 'trainer' && role !== 'client') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const newInvite = new Invite({
      role,
      createdBy: user.id,
      expiresAt: new Date(Date.now() + SEVEN_DAYS_MS),
      token: randomUUID(),
    });

    await newInvite.save();

    return res.status(201).json({
      token: newInvite.token,
      role: newInvite.role,
      expiresAt: newInvite.expiresAt,
    });
  },
);
