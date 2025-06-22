"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const book_route_1 = require("./routes/book.route");
const borrow_route_1 = require("./routes/borrow.route");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/books', book_route_1.BookRoutes);
app.use('/api/borrow', borrow_route_1.BorrowRoutes);
// Global error handler
app.use((err, req, res, next) => {
    res.status(400).json({
        success: false,
        message: err.message || 'Something went wrong',
        error: err,
    });
});
// Root endpoint
app.get('/', (req, res) => {
    res.send('📚 Library Management API Running');
});
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DATABASE_URI || 'mongodb+srv://admin:admin123@cluster0.2cqpb0d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose_1.default
    .connect(DB_URI)
    .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
});
exports.default = app;
