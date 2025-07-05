"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../controllers/book.controller");
const router = express_1.default.Router();
//  Create a book
router.post('/', book_controller_1.createBook);
//  Get all books (supports pagination, filter, sort)
router.get('/', book_controller_1.getAllBooks);
//  Get single book by ID
router.get('/:bookId', book_controller_1.getBookById);
//  Update book
router.patch('/:bookId', book_controller_1.updateBook); // ✅ Changed from PUT to PATCH
//  Delete book
router.delete('/:bookId', book_controller_1.deleteBook);
exports.default = router; // ✅ Changed export style
