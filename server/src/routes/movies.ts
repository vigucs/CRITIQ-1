import express, { Request, Response, NextFunction } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
} from '../controllers/movieController';

const router = express.Router();

// Helper function to convert middleware to the correct type
const typedProtect = protect as unknown as (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Public routes - using type assertions to work around TypeScript errors
router.get('/', (getAllMovies as unknown) as express.RequestHandler);
router.get('/tmdb/:id', (getMovie as unknown) as express.RequestHandler);
router.get('/search', (searchMovies as unknown) as express.RequestHandler);
router.get('/:id', (getMovie as unknown) as express.RequestHandler);

// Protected routes (admin only)
router.post('/', typedProtect, (createMovie as unknown) as express.RequestHandler);
router.put('/:id', typedProtect, (updateMovie as unknown) as express.RequestHandler);
router.delete('/:id', typedProtect, (deleteMovie as unknown) as express.RequestHandler);

export default router; 