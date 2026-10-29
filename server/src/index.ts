import mongoose from 'mongoose';
import { app } from './app.js';

const start = async () => { 
  const port = Number(process.env.PORT) || 3000;
  const url = process.env.MONGODB_URI;

  if (!url) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  await mongoose.connect(url)
  console.log('Connected to MongoDB');

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start().catch((err) => {
  console.error('Error starting the server:', err);
  process.exit(1);
});