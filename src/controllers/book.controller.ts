import { Request, Response, NextFunction } from 'express';
import { Book } from '../models/book.model';
import { sendResponse } from '../utils/sendResponse';

// CREATE
export const createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const book = await Book.create(req.body);
    sendResponse(res, book, 'Book created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// GET ALL WITH PAGINATION, FILTER, SORT
export const getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      filter,        // filter by genre
      sortBy = 'createdAt',
      sort = 'asc',
      limit = '10',
      page = '1',
    } = req.query;

    const parsedLimit = parseInt(limit as string) || 10;
    const parsedPage = parseInt(page as string) || 1;
    const skip = (parsedPage - 1) * parsedLimit;

    const query: any = {};
    if (filter) {
      query.genre = filter;
    }

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parsedLimit);

    sendResponse(res, {
      data: books,
      meta: {
        total,
        limit: parsedLimit,
        page: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
      },
    }, 'Books retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// GET BY ID
export const getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found',
        error: {},
      });
      return;
    }

    sendResponse(res, book, 'Book retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found',
        error: {},
      });
      return;
    }

    sendResponse(res, book, 'Book updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found',
        error: {},
      });
      return;
    }

    sendResponse(res, null, 'Book deleted successfully');
  } catch (error) {
    next(error);
  }
};
