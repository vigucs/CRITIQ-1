import express, { Request, Response, NextFunction } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import {
  getUsers,
  getCurrentUser,
  updateUserRole,
  deleteUser,
} from '../controllers/userController';

const router = express.Router();

// Helper function to convert middleware to the correct type
const typedProtect = protect as unknown as (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Current user route
router.get('/me', typedProtect, getCurrentUser as any);

// Admin routes
router.get('/', typedProtect, getUsers as any);
router.patch('/:id/role', typedProtect, updateUserRole as any);
router.delete('/:id', typedProtect, deleteUser as any);

export default router; 