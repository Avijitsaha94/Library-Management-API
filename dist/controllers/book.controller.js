"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooks = exports.createBook = void 0;
const book_model_1 = require("../models/book.model");
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            error,
        });
    }
});
exports.createBook = createBook;
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = 'createdAt', sort = 'asc', limit = '10' } = req.query;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const books = yield book_model_1.Book.find(query)
            .sort({ [sortBy]: sort === 'desc' ? -1 : 1 })
            .limit(parseInt(limit));
        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to retrieve books',
            error,
        });
    }
});
exports.getAllBooks = getAllBooks;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findById(req.params.bookId);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to retrieve book',
            error,
        });
    }
});
exports.getBookById = getBookById;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findByIdAndUpdate(req.params.bookId, req.body, {
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update book',
            error,
        });
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findByIdAndDelete(req.params.bookId);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to delete book',
            error,
        });
    }
});
exports.deleteBook = deleteBook;
