import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';
import { Invite } from '../models/invite.model.js';

export const authRouter = Router();

const registerSchema = z.object({
  token: z.uuid(),
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
});

authRouter.post('/register', validate(registerSchema), async (req, res) => {
  const { token } = req.body;

  const invite = await Invite.findOne({ token });

  if (!invite) {
    return res.status(400).json({ message: 'Invalid invite' });
  }

  if (invite.usedAt) {
    return res.status(400).json({ message: 'Invite already used' });
  }

  if (invite.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Invite expired' });
  }

  return res.json({
    ok: true,
    role: invite.role,
  });
});
