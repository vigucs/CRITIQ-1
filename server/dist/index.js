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
const PORT = parseInt(process.env.PORT || '5000', 10);
// Middleware setup
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Set up CORS
app.use((0, cors_1.default)({
    origin: process.env.DOCKER_ENV ? 'http://client:3000' : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`, {
        body: req.method !== 'GET' ? req.body : undefined,
        query: req.query,
        headers: {
            'content-type': req.headers['content-type'],
            'authorization': req.headers['authorization'] ? 'present' : 'not present'
        }
    });
    next();
});
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.message
        });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Authentication Error',
            details: err.message
        });
    }
    res.status(500).json({
        error: 'Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});
// Initialize server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Starting server with environment:', {
            NODE_ENV: process.env.NODE_ENV,
            DOCKER_ENV: process.env.DOCKER_ENV,
            PORT: PORT,
            MONGODB_URI: process.env.MONGODB_URI
        });
        // Connect to MongoDB
        yield (0, database_1.default)();
        // Start server
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API is available at http://0.0.0.0:${PORT}/api`);
        });
        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
            process.exit(1);
        });
        // Handle process termination
        process.on('SIGTERM', () => {
            console.log('Received SIGTERM signal. Shutting down gracefully...');
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });
        process.on('SIGINT', () => {
            console.log('Received SIGINT signal. Shutting down gracefully...');
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
startServer();
