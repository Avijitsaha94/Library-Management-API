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
exports.getBorrowSummary = exports.borrowBook = void 0;
const borrow_model_1 = require("../models/borrow.model");
const book_model_1 = require("../models/book.model");
const sendResponse_1 = require("../utils/sendResponse");
const updateAvailability = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findById(bookId);
    if (book && book.copies <= 0) {
        book.available = false;
        yield book.save();
    }
});
const borrowBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        // Check if the book exists
        const book = yield book_model_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: 'Book not found',
            });
            return; // important: stop further execution
        }
        //  Validate quantity
        if (quantity > book.copies) {
            res.status(400).json({
                success: false,
                message: 'Requested quantity exceeds available copies',
            });
            return; // stop further execution
        }
        //  Update book copies and availability
        book.copies -= quantity;
        if (book.copies === 0) {
            book.available = false;
        }
        yield book.save();
        //  Create borrow entry
        const borrow = yield borrow_model_1.Borrow.create({ book: bookId, quantity, dueDate });
        //  Respond success
        (0, sendResponse_1.sendResponse)(res, borrow, 'Book borrowed successfully', 201);
    }
    catch (error) {
        next(error);
    }
});
exports.borrowBook = borrowBook;
//  Borrow Summary Controller (with aggregation)
const getBorrowSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
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
        (0, sendResponse_1.sendResponse)(res, { data: summary }, 'Borrowed books summary retrieved successfully', 200);
    }
    catch (error) {
        next(error);
    }
});
exports.getBorrowSummary = getBorrowSummary;
