import express from 'express';
import { borrowBook, getBorrowSummary } from '../controllers/borrow.controller';
import { validateRequest } from '../middleware/validateRequest';    // ✨ Add this
import { borrowBookZodSchema } from '../validators/borrow.validation'; // ✨ Add this

const router = express.Router();

//  Borrow a book with validation middleware
router.post('/', validateRequest(borrowBookZodSchema), borrowBook);

//  Borrow summary (aggregation)
router.get('/summary', getBorrowSummary);

export default router;


