import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';

const start = async () => {
  const email = env.ADMIN_EMAIL;
  const pass = env.ADMIN_PASSWORD;

  if (typeof pass !== 'string' || typeof email !== 'string') {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required for seeding');
  }

  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const admin = await User.findOne({ role: 'admin' });

  if (admin) {
    console.log('Admin already exists');
  } else {
    const hashPass = await bcrypt.hash(pass, 10);
    const newAdmin = new User({
      role: 'admin',
      passwordHash: hashPass,
      email,
      firstName: 'Pavlo',
      lastName: 'Khashchevskyi',
    });
    await newAdmin.save();
    console.log('Admin created');
  }

  await mongoose.disconnect();
};

start().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
