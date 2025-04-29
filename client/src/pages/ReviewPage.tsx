import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getReview } from '../services/api';
import ReviewCard from '../components/ReviewCard';
import { Review } from '../types/api';

const ReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      if (id) {
        try {
          const reviewData = await getReview(id);
          setReview(reviewData);
        } catch (error) {
          console.error('Error fetching review:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReview();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!review) {
    return <div>Review not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Review for {review.movieTitle}
      </h1>
      <ReviewCard review={review} />
    </div>
  );
};

export default ReviewPage; 