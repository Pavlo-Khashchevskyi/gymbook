import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';
import { Invite } from '../models/invite.model.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

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

  const { email, password, firstName, lastName } = req.body;

  const checkEmail = await User.exists({ email });

  if (checkEmail) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    passwordHash,
    firstName,
    lastName,
    role: invite.role,
    trainerId: invite.role === 'client' ? invite.createdBy : null,
  });

  invite.usedAt = new Date();

  await invite.save();

  return res.status(201).json({
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  });
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

authRouter.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: 'Account is disabled' });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: '1d' },
  );

  return res.json({
    token,
    user: { id: user._id, email: user.email, role: user.role },
  });
});
