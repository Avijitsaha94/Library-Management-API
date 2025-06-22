import { Schema, model, Document } from 'mongoose';

const genres = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'];

interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  updateAvailability(): Promise<void>;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: {
        values: genres,
        message: 'Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY',
      },
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
    },
    description: {
      type: String,
    },
    copies: {
      type: Number,
      required: [true, 'Copies is required'],
      min: [0, 'Copies must be a positive number'],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Instance method to update availability based on copies count
bookSchema.methods.updateAvailability = async function () {
  this.available = this.copies > 0;
  await this.save();
};

// Middleware: pre 'save' to ensure copies is never negative
bookSchema.pre('save', function (next) {
  if (this.copies < 0) {
    next(new Error('Copies cannot be negative'));
  } else {
    next();
  }
});

export const Book = model<IBook>('Book', bookSchema);
