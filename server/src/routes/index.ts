import express, { Request, Response, NextFunction } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import {
  register,
  login,
  googleLogin,
} from '../controllers/authController';
import {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController';
import statsRoutes from './stats';
import movieRoutes from './movies';
import userRoutes from './users';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/google', googleLogin);

// Add a special route for development login that bypasses MongoDB
router.post('/auth/dev-login', (req, res) => {
  const { email = 'dev@example.com', name = 'Development User' } = req.body;
  console.log('DEV MODE: Creating dev user login');
  
  // Use type assertions to bypass TypeScript checking for JWT
  const jwtSign = jwt.sign as any;
  const token = jwtSign(
    { id: 'dev-user-id' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  
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
router.use('/movies', movieRoutes);

// User routes
router.use('/users', userRoutes);

// Helper function to properly type middleware with AuthRequest
const typedProtect = protect as unknown as (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Review routes
router.post('/reviews', typedProtect, createReview as any);
router.get('/reviews', typedProtect, getReviews as any);

// Stats routes - place before the :id route to avoid conflict
router.use('/reviews', statsRoutes);

// Handle 'new' as a reserved word for review routes, so it doesn't get treated as an ID
router.get('/reviews/new', (req, res) => {
  res.redirect('/reviews');
});

// Individual review routes
router.get('/reviews/:id', typedProtect, getReview as any);
router.put('/reviews/:id', typedProtect, updateReview as any);
router.delete('/reviews/:id', typedProtect, deleteReview as any);

// Add a health check route
router.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  
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

export default router; 