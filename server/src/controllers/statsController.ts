import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Review from '../models/Review';
import User from '../models/User';

// Get overall statistics
export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalReviews,
      totalUsers,
      averageRating,
      sentimentStats,
      recentReviews,
      monthlyStats
    ] = await Promise.all([
      Review.countDocuments(),
      User.countDocuments(),
      Review.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' }
          }
        }
      ]),
      Review.aggregate([
        {
          $group: {
            _id: '$sentiment',
            count: { $sum: 1 }
          }
        }
      ]),
      Review.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name')
        .lean(),
      Review.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': -1, '_id.month': -1 }
        }
      ])
    ]);

    // Handle empty database case
    const stats = {
      totalReviews: totalReviews || 0,
      totalUsers: totalUsers || 0,
      averageRating: averageRating.length > 0 && averageRating[0]?.averageRating 
        ? Number(averageRating[0].averageRating.toFixed(1)) 
        : 0,
      sentimentBreakdown: sentimentStats.reduce((acc: any, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, { positive: 0, negative: 0, neutral: 0 }),
      recentReviews: recentReviews || [],
      monthlyStats: monthlyStats || []
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      message: 'Error fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user statistics
export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;

    const [
      totalReviews,
      averageRating,
      sentimentStats,
      recentReviews,
      monthlyStats
    ] = await Promise.all([
      Review.countDocuments({ userId }),
      Review.aggregate([
        {
          $match: { userId }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' }
          }
        }
      ]),
      Review.aggregate([
        {
          $match: { userId }
        },
        {
          $group: {
            _id: '$sentiment',
            count: { $sum: 1 }
          }
        }
      ]),
      Review.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name')
        .lean(),
      Review.aggregate([
        {
          $match: { userId }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': -1, '_id.month': -1 }
        }
      ])
    ]);

    // Handle empty database case
    const stats = {
      totalReviews: totalReviews || 0,
      averageRating: averageRating.length > 0 && averageRating[0]?.averageRating 
        ? Number(averageRating[0].averageRating.toFixed(1)) 
        : 0,
      sentimentBreakdown: sentimentStats.reduce((acc: any, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, { positive: 0, negative: 0, neutral: 0 }),
      recentReviews: recentReviews || [],
      monthlyStats: monthlyStats || []
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      message: 'Error fetching user statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 