import express from 'express';
import mongoose from 'mongoose';

const app = express();

const port = Number(process.env.PORT) || 8000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);

    app.listen(port, () => {
      console.log(`Backend API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start backend service', error);
    process.exit(1);
  }
};

void start();
