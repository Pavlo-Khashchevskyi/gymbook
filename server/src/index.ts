import mongoose from 'mongoose';
import { app } from './app.js';
import { env } from './config/env.js';

const start = async () => {
  const port = env.PORT;

  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB');

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start().catch((err) => {
  console.error('Error starting the server:', err);
  process.exit(1);
});
