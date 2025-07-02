import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import bookRoutes from './routes/book.route';
import borrowRoutes from './routes/borrow.route';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Application Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrows', borrowRoutes); // ✅ Changed to plural for REST convention

// Root Route
app.get('/', (_req: Request, res: Response) => {
  res.send(' Library Management API Running');
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong',
    error: err,
  });
});

// Database connection & server start
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/library-api';

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err.message);
    process.exit(1);
  });

export default app;
