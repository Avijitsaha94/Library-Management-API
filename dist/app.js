"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const book_route_1 = __importDefault(require("./routes/book.route"));
const borrow_route_1 = __importDefault(require("./routes/borrow.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ['https://library-management-frontend-kappa.vercel.app']
}));
app.use(express_1.default.json());
// Application Routes
app.use('/api/books', book_route_1.default);
app.use('/api/borrows', borrow_route_1.default); // ✅ Changed to plural for REST convention
// Root Route
app.get('/', (_req, res) => {
    res.send(' Library Management API Running');
});
// Global Error Handler
app.use((err, _req, res, _next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Something went wrong',
        error: err,
    });
});
// Database connection & server start
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/library-api';
mongoose_1.default
    .connect(DB_URI)
    .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(` Server running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error(' MongoDB connection failed:', err.message);
    process.exit(1);
});
exports.default = app;
