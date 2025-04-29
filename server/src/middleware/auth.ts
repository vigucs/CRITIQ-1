import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser } from '../models/User';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user: {
    id: string;
    role?: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      // Get user from the token, excluding password
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Add user to request
      req.user = {
        id: decoded.id,
        role: user.role,
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
}; 