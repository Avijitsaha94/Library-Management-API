import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { BookRoutes } from './routes/book.route';
import { BorrowRoutes } from './routes/borrow.route';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/books', BookRoutes);
app.use('/api/borrow', BorrowRoutes);

// Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  res.status(400).json({
    success: false,
    message: err.message || 'Something went wrong',
    error: err,
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('📚 Library Management API Running');
});

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DATABASE_URI || 'mongodb+srv://admin:admin123@cluster0.2cqpb0d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });

export default app;
