import 'dotenv/config'; // Load .env file
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { errorMiddleware } from './middleware/error.middleware';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is up and running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Ensure the MONGODB_URI is loaded beore attempting to connect
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      // Firebase App Hosting provides the public URL in this environment variable
      if (process.env.APP_URL) {
        console.log(`Public API URL: ${process.env.APP_URL}`);
      }
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit on connection error
  });
