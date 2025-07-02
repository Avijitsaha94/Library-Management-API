import express from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/book.controller';

const router = express.Router();

//  Create a book
router.post('/', createBook);

//  Get all books (supports pagination, filter, sort)
router.get('/', getAllBooks);

//  Get single book by ID
router.get('/:bookId', getBookById);

//  Update book
router.patch('/:bookId', updateBook); // ✅ Changed from PUT to PATCH

//  Delete book
router.delete('/:bookId', deleteBook);

export default router; // ✅ Changed export style
