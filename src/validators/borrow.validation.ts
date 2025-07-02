import { z } from 'zod';

export const borrowBookZodSchema = z.object({
  book: z.string().min(1, "Book ID is required"),   //  Add min length check
  quantity: z.number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
  dueDate: z.string().refine(dateStr => {
    const d = new Date(dateStr);
    return d > new Date();
  }, {
    message: "Due date must be a future date"
  }),
});

