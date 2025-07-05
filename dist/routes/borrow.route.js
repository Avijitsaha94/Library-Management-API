"use strict";
// src/routes/borrow.route.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const borrow_controller_1 = require("../controllers/borrow.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const borrow_validation_1 = require("../validators/borrow.validation");
const router = express_1.default.Router();
// ✅ POST /api/borrows → Borrow a book with Zod validation
router.post('/', (0, validateRequest_1.validateRequest)(borrow_validation_1.borrowBookZodSchema), borrow_controller_1.borrowBook);
// ✅ GET /api/borrows/summary → Borrow Summary aggregation
router.get('/summary', borrow_controller_1.getBorrowSummary);
exports.default = router;
