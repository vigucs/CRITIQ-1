import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ReviewFormProps {
  onSubmit: (reviewText: string) => Promise<void>;
  movieTitle?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, movieTitle }) => {
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(reviewText);
      setReviewText('');
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to submit review';
      setError(errorMessage);
      
      if (errorMessage.includes('logged in') || errorMessage.includes('session expired')) {
        setTimeout(() => {
          navigate('/login', { state: { from: window.location.pathname } });
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
      <p className="text-gray-600 mb-4">
        Share your thoughts about this movie. Our AI will automatically determine a rating based on your review.
      </p>
      
      {!user && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          You need to be logged in to submit a review. 
          <button 
            onClick={() => navigate('/login', { state: { from: window.location.pathname } })} 
            className="ml-2 text-blue-600 hover:underline"
          >
            Log in now
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            id="reviewText"
            name="reviewText"
            rows={6}
            required
            value={reviewText}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Share your thoughts about this movie... (Min. 10 characters)"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !user}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              loading || !user
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm; 