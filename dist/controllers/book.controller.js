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
const sendResponse_1 = require("../utils/sendResponse");
// CREATE
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.create(req.body);
        (0, sendResponse_1.sendResponse)(res, book, 'Book created successfully', 201);
    }
    catch (error) {
        next(error);
    }
});
exports.createBook = createBook;
// GET ALL WITH PAGINATION, FILTER, SORT
const getAllBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, // filter by genre
        sortBy = 'createdAt', sort = 'asc', limit = '10', page = '1', } = req.query;
        const parsedLimit = parseInt(limit) || 10;
        const parsedPage = parseInt(page) || 1;
        const skip = (parsedPage - 1) * parsedLimit;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const total = yield book_model_1.Book.countDocuments(query);
        const books = yield book_model_1.Book.find(query)
            .sort({ [sortBy]: sort === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(parsedLimit);
        (0, sendResponse_1.sendResponse)(res, {
            data: books,
            meta: {
                total,
                limit: parsedLimit,
                page: parsedPage,
                totalPages: Math.ceil(total / parsedLimit),
            },
        }, 'Books retrieved successfully');
    }
    catch (error) {
        next(error);
    }
});
exports.getAllBooks = getAllBooks;
// GET BY ID
const getBookById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        (0, sendResponse_1.sendResponse)(res, book, 'Book retrieved successfully');
    }
    catch (error) {
        next(error);
    }
});
exports.getBookById = getBookById;
// UPDATE
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        (0, sendResponse_1.sendResponse)(res, book, 'Book updated successfully');
    }
    catch (error) {
        next(error);
    }
});
exports.updateBook = updateBook;
// DELETE
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        (0, sendResponse_1.sendResponse)(res, null, 'Book deleted successfully');
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBook = deleteBook;
