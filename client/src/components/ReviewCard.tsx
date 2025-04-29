import React from 'react';
import { Link } from 'react-router-dom';
import { Review } from '../types/api';

interface ReviewCardProps {
  review: Review;
}

interface ReviewWithSentimentScore extends Review {
  sentimentScore?: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const r = review as ReviewWithSentimentScore;
  const sentimentColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[review.sentiment.toLowerCase()] || 'text-gray-600';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link
      to={`/review/${review.id}`}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {review.movieTitle}
          </h3>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="text-gray-600">{review.rating}/10</span>
          </div>
        </div>

        <p className="text-gray-600 line-clamp-3">{review.reviewText}</p>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            By {review.user?.name || 'Anonymous User'} • {formatDate(review.createdAt)}
          </span>
          <span className={`font-medium ${sentimentColor}`}>
            {review.sentiment}
            {typeof r.sentimentScore === 'number' && (
              <span className="ml-2">({r.sentimentScore}%)</span>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ReviewCard; 