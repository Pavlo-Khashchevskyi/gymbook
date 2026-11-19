import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { requireRole } from '../middlewares/requireRole.js';
import { Invite } from '../models/invite.model.js';

export const invitesRouter = Router();

invitesRouter.get(
  '/',
  requireAuth,
  requireRole('trainer', 'admin'),
  async (req, res) => {
    const { user } = req;

    if (!user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const invites = await Invite.find({ createdBy: user.id }).sort({
      createdAt: -1,
    });

    return res.json(invites);
  },
);
