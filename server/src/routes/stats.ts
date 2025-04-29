import express, { Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/auth';
import { getStats, getUserStats } from '../controllers/statsController';

const router = express.Router();

// Helper function to properly type middleware with AuthRequest
const typedProtect = protect as unknown as (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Get overall statistics
router.get('/stats', typedProtect, getStats as any);

// Get user statistics
router.get('/stats/user/:userId', typedProtect, getUserStats as any);

export default router; 