// src/routes/borrow.route.ts

import express from 'express';
import { borrowBook, getBorrowSummary } from '../controllers/borrow.controller';
import { validateRequest } from '../middleware/validateRequest';
import { borrowBookZodSchema } from '../validators/borrow.validation';

const router = express.Router();

// ✅ POST /api/borrows → Borrow a book with Zod validation
router.post('/', validateRequest(borrowBookZodSchema), borrowBook);

// ✅ GET /api/borrows/summary → Borrow Summary aggregation
router.get('/summary', getBorrowSummary);

export default router;
