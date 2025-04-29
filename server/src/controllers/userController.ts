import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Review from '../models/Review';
import mongoose from 'mongoose';
import { PipelineStage } from 'mongoose';

// Get all users with review counts
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view all users' });
    }

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'userId',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          reviewCount: { $size: '$reviews' },
        },
      },
      {
        $project: {
          password: 0,
          reviews: 0,
        },
      },
      {
        $sort: { createdAt: -1 as -1 },
      },
    ];

    const users = await User.aggregate(pipeline);
    res.json(users);
  } catch (error: any) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get review count
    const reviewCount = await Review.countDocuments({ userId });

    res.json({ ...user.toObject(), reviewCount });
  } catch (error: any) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user role
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update user roles' });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete users' });
    }

    const { id } = req.params;

    // Don't allow deleting yourself
    if (id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all reviews by this user
    await Review.deleteMany({ userId: id });

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
}; 