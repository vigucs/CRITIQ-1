import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiStar, FiArrowLeft } from 'react-icons/fi';
import Icon from '../components/Icon';
import { createReview } from '../services/api';
import { getMovie } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getReviews } from '../services/api';

interface Movie {
  _id: string;
  title: string;
  year: string;
  genre: string;
  imageUrl: string;
  description: string;
  tmdbId: string;
  runtime: number;
  reviewCount: number;
  avgRating: number;
  reviews: Review[];
}

interface Review {
  _id: string;
  movieId: string;
  movieTitle: string;
  reviewText: string;
  rating: number;
  sentiment: string;
  createdAt: string;
  userName?: string;
}

const NewReviewPage: React.FC = () => {
  // const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    const fetchMovieAndReview = async () => {
      try {
        if (!id) throw new Error('Movie ID is required');
        const movieData = await getMovie(id);
        setMovie(movieData);
        if (user && movieData?._id) {
          const reviewRes = await getReviews({ movieId: movieData._id, userId: user.id });
          if (reviewRes.reviews && reviewRes.reviews.length > 0) {
            setUserReview(reviewRes.reviews[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        setError(error instanceof Error ? error.message : 'Failed to load movie');
      } finally {
        setLoading(false);
      }
    };
    fetchMovieAndReview();
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movie) return;

    try {
      await createReview({
        movieId: movie._id,
        movieTitle: movie.title,
        reviewText: reviewText.trim(),
        rating: 0,
      });
      navigate(`/movies/${movie._id}`);
    } catch (error) {
      console.error('Error creating review:', error);
      setError(error instanceof Error ? error.message : 'Failed to create review');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-8">{error || 'Movie not found'}</p>
        <button
          onClick={() => navigate('/movies')}
          className="text-blue-600 hover:underline flex items-center justify-center"
        >
          <Icon icon={FiArrowLeft} size={20} className="mr-2" /> Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate(`/movies/${movie._id}`)}
          className="flex items-center text-blue-600 hover:underline mb-6"
        >
          <Icon icon={FiArrowLeft} size={20} className="mr-2" />
          Back to Movie
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Write a Review for {movie.title}</h1>

          {userReview ? (
            <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
              <p className="mb-2 font-semibold">You have already reviewed this movie. You can only submit one review per movie.</p>
              <p className="mb-2">Your review: <span className="font-medium">{userReview.reviewText}</span></p>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2"
                onClick={() => navigate(`/review/${userReview._id}`)}
              >
                Edit Your Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-600 bg-red-100 rounded p-2 mb-4">
                  {error === "You have already reviewed this movie"
                    ? "You have already reviewed this movie. You can only submit one review per movie. If you want to update your review, please use the Edit button below."
                    : error}
                </div>
              )}
              <div>
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="review"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about the movie..."
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={!reviewText.trim()}
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewReviewPage; 