import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';
import { Invite } from '../models/invite.model.js';
import { randomUUID } from 'crypto';

const start = async () => {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const admin = await User.findOne({ role: 'admin' });

  if (!admin) {
    throw new Error('Cann"t find admin');
  }

  const newInvite = new Invite({
    role: 'trainer',
    createdBy: admin._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    token: randomUUID(),
  });

  await newInvite.save();
  console.log('Invite token:', newInvite.token)
  console.log('Invite created');

  await mongoose.disconnect();
};

start().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
