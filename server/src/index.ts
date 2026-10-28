import express from 'express';

const app = express();

const start = async () => {
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start().catch((err) => {
  console.error('Error starting the server:', err);
  process.exit(1);
});