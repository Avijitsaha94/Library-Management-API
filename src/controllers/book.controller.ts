import { Request, Response } from 'express';
import { Book } from '../models/book.model';

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error,
    });
  }
};

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'asc', limit = '10' } = req.query;

    const query: any = {};
    if (filter) {
      query.genre = filter;
    }

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === 'desc' ? -1 : 1 })
      .limit(parseInt(limit as string));

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve books',
      error,
    });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
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
    res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve book',
      error,
    });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
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
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update book',
      error,
    });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
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
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete book',
      error,
    });
  }
};
