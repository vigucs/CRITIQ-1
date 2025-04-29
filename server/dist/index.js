"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, database_1.default)();
// Middleware
app.use((0, cors_1.default)()); // Allow all origins in development
app.use(express_1.default.json());
// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/api', routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        code: err.code,
        name: err.name
    });
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API is available at http://localhost:${PORT}/api`);
});
