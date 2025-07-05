"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowBookZodSchema = void 0;
const zod_1 = require("zod");
exports.borrowBookZodSchema = zod_1.z.object({
    book: zod_1.z.string().min(1, "Book ID is required"), //  Add min length check
    quantity: zod_1.z.number()
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1"),
    dueDate: zod_1.z.string().refine(dateStr => {
        const d = new Date(dateStr);
        return d > new Date();
    }, {
        message: "Due date must be a future date"
    }),
});
