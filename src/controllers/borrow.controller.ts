import { Request, Response } from 'express';
import { Borrow } from '../models/borrow.model';
import { Book } from '../models/book.model';

// Static method to update availability
const updateAvailability = async (bookId: string) => {
  const book = await Book.findById(bookId);
  if (book && book.copies <= 0) {
    book.available = false;
    await book.save();
  }
};

export const borrowBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.copies < quantity) {
      res.status(400).json({
        success: false,
        message: 'Not enough copies available',
        error: {},
      });
      return;
    }

    // Update book copies
    book.copies -= quantity;
    await book.save();

    // Check if available needs to be updated
    await updateAvailability(book._id!.toString());


    // Save borrow record
    const borrow = await Borrow.create({ book: bookId, quantity, dueDate });

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrow,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Borrow failed',
      error,
    });
  }
};

export const getBorrowSummary = async (req: Request, res: Response): Promise<void> => {
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
      {
        $unwind: '$bookDetails',
      },
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

    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Aggregation failed',
      error,
    });
  }
};
