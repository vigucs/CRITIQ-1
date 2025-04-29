import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Review from '../models/Review';
import mongoose from 'mongoose';
import axios from 'axios';

interface SentimentStat {
  sentiment: string;
  count: number;
}

interface SentimentCounts {
  [key: string]: number;
}

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5500';

// Helper function to recalculate movie ratings
const recalculateMovieRating = async (movieId: string) => {
  try {
    const result = await Review.aggregate([
      { $match: { movieId } },
      {
        $group: {
          _id: '$movieId',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
          sentimentStats: {
            $push: {
              sentiment: '$sentiment',
              count: 1
            }
          }
        }
      }
    ]);
    
    if (result.length === 0) {
      return {
        averageRating: '0.0',
        ratingCount: 0,
        sentimentPercentages: {
          positive: 0,
          negative: 0,
          neutral: 0
        }
      };
    }
    
    const averageRating = result[0].averageRating || 0;
    const ratingCount = result[0].ratingCount || 0;
    
    // Calculate sentiment percentages
    const sentimentStats = result[0].sentimentStats || [];
    const sentimentCounts = sentimentStats.reduce((acc: SentimentCounts, stat: SentimentStat) => {
      acc[stat.sentiment] = (acc[stat.sentiment] || 0) + stat.count;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });

    const totalSentiments: number = Object.values(sentimentCounts).reduce((sum: number, count) => 
      sum + (count as number), 0
    );

    const sentimentPercentages = Object.entries(sentimentCounts).reduce((acc: SentimentCounts, [sentiment, count]) => {
      const numCount = count as number;
      acc[sentiment as keyof SentimentCounts] = totalSentiments > 0 ? Math.round((numCount / totalSentiments) * 100) : 0;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });
    
    return {
      averageRating: averageRating.toFixed(1),
      ratingCount,
      sentimentPercentages
    };
  } catch (error) {
    console.error('Error recalculating movie rating:', error);
    throw error;
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId, reviewText } = req.body;
    const userId = req.user?.id;

    // Call ML API for sentiment analysis
    const mlResponse = await axios.post(`${process.env.ML_API_URL}/predict`, {
      text: reviewText
    });

    const { sentiment, sentiment_score, rating: mlRating } = mlResponse.data;

    // Create review with sentiment analysis
    const review = await Review.create({
      movieId,
      userId,
      reviewText,
      rating: mlRating, // Use ML-generated rating
      sentiment,
      sentimentScore: sentiment_score
    });

    // Recalculate movie rating
    await recalculateMovieRating(movieId);

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
};

export const getReviews = async (req: AuthRequest, res: Response) => {
  try {
    // Support userId from query params or from logged-in user
    const userIdFromQuery = req.query.userId as string | undefined;
    const userId = userIdFromQuery || req.user?.id;
    const { movieId, page = 1, limit = 10, sort = 'newest' } = req.query;
    
    let query: any = {};
    let filterByUser = false;
    
    if (userId && !movieId) {
      // Flexible match: allow both string and ObjectId
      query.userId = { $in: [userId, new mongoose.Types.ObjectId(userId)] };
      filterByUser = true;
    } else if (movieId) {
      query.movieId = movieId;
    }

    // Debug logging
    console.log('getReviews: userId:', userId);
    console.log('getReviews: query:', JSON.stringify(query));
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Determine sort order
    let sortOptions: any = { createdAt: -1 }; // Default: newest first
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'highest') {
      sortOptions = { rating: -1 };
    } else if (sort === 'lowest') {
      sortOptions = { rating: 1 };
    }
    
    const reviews = await Review.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .populate('userId', 'name');

    // Debug logging
    console.log('getReviews: reviews found:', reviews.length);
    
    const total = await Review.countDocuments(query);
    
    // Get movie stats if movieId is provided
    let stats = null;
    if (movieId) {
      stats = await recalculateMovieRating(movieId as string);
    }

    // Calculate user-specific average rating if filtering by user
    let userAvgRating = null;
    if (filterByUser) {
      const userReviews = await Review.find({ userId: { $in: [userId, new mongoose.Types.ObjectId(userId)] } });
      if (userReviews.length > 0) {
        userAvgRating = (
          userReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / userReviews.length
        ).toFixed(1);
      }
    }
    
    res.json({
      reviews,
      stats,
      userAvgRating,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const review = await Review.findOne({ 
      _id: id,
      ...(userId ? { userId } : {})
    }).populate('userId', 'name');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { movieTitle, reviewText } = req.body;

    const existingReview = await Review.findOne({ _id: id, userId });
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    const movieId = existingReview.movieId;

    let updateFields: any = { movieTitle };

    // If reviewText is being updated, re-run sentiment analysis
    if (reviewText && reviewText !== existingReview.reviewText) {
      const mlResponse = await axios.post(`${process.env.ML_API_URL}/predict`, {
        text: reviewText
      });
      const { sentiment, sentiment_score, rating: mlRating } = mlResponse.data;
      updateFields = {
        ...updateFields,
        reviewText,
        rating: mlRating,
        sentiment,
        sentimentScore: sentiment_score
      };
    }

    const review = await Review.findOneAndUpdate(
      { _id: id, userId },
      updateFields,
      { new: true, runValidators: true }
    ).populate('userId', 'name');

    // Recalculate movie rating after updating a review
    const stats = await recalculateMovieRating(movieId);

    res.json({
      review,
      stats
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    const existingReview = await Review.findOne({ 
      _id: id, 
      ...(isAdmin ? {} : { userId }) 
    });
    
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const movieId = existingReview.movieId;

    const query = isAdmin ? { _id: id } : { _id: id, userId };

    const review = await Review.findOneAndDelete(query);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Recalculate movie rating after deleting a review
    const stats = await recalculateMovieRating(movieId);

    res.json({
      message: 'Review deleted successfully',
      stats
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 