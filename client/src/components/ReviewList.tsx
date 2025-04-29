import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReviews } from '../services/api';
import ReviewCard from './ReviewCard';
import LoadingSpinner from './LoadingSpinner';
import { Review } from '../types/api';

interface ReviewListProps {
  userId?: string;
  movieId?: string;
  limit?: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ userId, movieId, limit = 10 }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadReviews = async (page = 1) => {
    try {
      setLoading(true);
      const pageLimit = limit || 5;
      
      // Create proper params object for getReviews
      const params: { 
        page: number; 
        limit: number;
        movieId?: string;
        userId?: string;
      } = {
        page,
        limit: pageLimit
      };
      
      if (movieId) {
        params.movieId = movieId;
      }
      
      if (userId) {
        params.userId = userId;
      }
      
      const response = await getReviews(params);
      const newReviews = response.reviews;
      setReviews(prev => (page === 1 ? newReviews : [...prev, ...newReviews]));
      setHasMore(newReviews.length === pageLimit);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [page, userId, movieId, limit]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.length === 0 && !loading ? (
        <div className="text-center text-gray-500 py-8">
          No reviews found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default ReviewList; 