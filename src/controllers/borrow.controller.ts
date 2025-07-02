import { Request, Response, NextFunction } from 'express';
import { Borrow } from '../models/borrow.model';
import { Book } from '../models/book.model';
import { sendResponse } from '../utils/sendResponse';

// ✅ Static helper to update availability (optional)
const updateAvailability = async (bookId: string): Promise<void> => {
  const book = await Book.findById(bookId);
  if (book && book.copies <= 0) {
    book.available = false;
    await book.save();
  }
};

// ✅ Borrow Book Controller
export const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    // 1️⃣ Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found',
      });
      return; // important: stop further execution
    }

    // 2️⃣ Validate quantity
    if (quantity > book.copies) {
      res.status(400).json({
        success: false,
        message: 'Requested quantity exceeds available copies',
      });
      return; // stop further execution
    }

    // 3️⃣ Update book copies and availability
    book.copies -= quantity;
    if (book.copies === 0) {
      book.available = false;
    }
    await book.save();

    // 4️⃣ Create borrow entry
    const borrow = await Borrow.create({ book: bookId, quantity, dueDate });

    // 5️⃣ Respond success
    sendResponse(res, borrow, 'Book borrowed successfully', 201);
  } catch (error) {
    next(error);
  }
};

// ✅ Borrow Summary Controller (with aggregation)
export const getBorrowSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
      { $unwind: '$bookDetails' },
      {
        $project: {
          _id: 0,
          book: {
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn',
          },
          totalQuantity: 1,
        },
      },
    ]);

    sendResponse(res, { data: summary }, 'Borrowed books summary retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};
