"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const authController_1 = require("../controllers/authController");
const reviewController_1 = require("../controllers/reviewController");
const stats_1 = __importDefault(require("./stats"));
const movies_1 = __importDefault(require("./movies"));
const users_1 = __importDefault(require("./users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// Auth routes
router.post('/auth/register', authController_1.register);
router.post('/auth/login', authController_1.login);
router.post('/auth/google', authController_1.googleLogin);
// Add a special route for development login that bypasses MongoDB
router.post('/auth/dev-login', (req, res) => {
    const { email = 'dev@example.com', name = 'Development User' } = req.body;
    console.log('DEV MODE: Creating dev user login');
    // Use type assertions to bypass TypeScript checking for JWT
    const jwtSign = jsonwebtoken_1.default.sign;
    const token = jwtSign({ id: 'dev-user-id' }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.json({
        token,
        user: {
            id: 'dev-user-id',
            name: name || 'Development User',
            email: email || 'dev@example.com',
            role: 'admin'
        },
    });
});
// Movie routes
router.use('/movies', movies_1.default);
// User routes
router.use('/users', users_1.default);
// Helper function to properly type middleware with AuthRequest
const typedProtect = auth_1.protect;
// Review routes
router.post('/reviews', typedProtect, reviewController_1.createReview);
router.get('/reviews', typedProtect, reviewController_1.getReviews);
// Stats routes - place before the :id route to avoid conflict
router.use('/reviews', stats_1.default);
// Handle 'new' as a reserved word for review routes, so it doesn't get treated as an ID
router.get('/reviews/new', (req, res) => {
    res.redirect('/reviews');
});
// Individual review routes
router.get('/reviews/:id', typedProtect, reviewController_1.getReview);
router.put('/reviews/:id', typedProtect, reviewController_1.updateReview);
router.delete('/reviews/:id', typedProtect, reviewController_1.deleteReview);
// Add a health check route
router.get('/health', (req, res) => {
    const isDbConnected = mongoose_1.default.connection.readyState === 1;
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mongodb: isDbConnected ? 'connected' : 'disconnected',
        env: process.env.NODE_ENV || 'development'
    });
});
// Development mode mock handlers
if (process.env.DEV_MODE === 'true') {
    console.log('Setting up DEV MODE API endpoints');
    // Mock reviews for dev mode
    const mockReviews = [
        {
            _id: 'mock-review-1',
            movieId: 'mock-movie-1',
            movieTitle: 'Inception',
            reviewText: 'This is a mock review for testing purposes.',
            rating: 5,
            sentiment: 'positive',
            userId: 'dev-user-id',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: 'mock-review-2',
            movieId: 'mock-movie-2',
            movieTitle: 'The Dark Knight',
            reviewText: 'Another mock review for testing the API.',
            rating: 4,
            sentiment: 'positive',
            userId: 'dev-user-id',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    // Mock routes for development
    router.get('/dev/reviews', (req, res) => {
        res.json({
            reviews: mockReviews,
            totalPages: 1,
            currentPage: 1,
            totalReviews: mockReviews.length
        });
    });
    router.post('/dev/reviews', (req, res) => {
        const { movieId, movieTitle, reviewText, rating, sentiment } = req.body;
        const newReview = {
            _id: `mock-review-${Date.now()}`,
            movieId,
            movieTitle,
            reviewText,
            rating,
            sentiment,
            userId: 'dev-user-id',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockReviews.push(newReview);
        res.status(201).json(newReview);
    });
    router.get('/dev/stats', (req, res) => {
        res.json({
            totalReviews: mockReviews.length,
            averageRating: 4.5,
            sentimentBreakdown: { positive: 2, neutral: 0, negative: 0 },
            recentReviews: mockReviews
        });
    });
}
exports.default = router;
