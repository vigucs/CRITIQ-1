import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovie, getReviews } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiArrowLeft, FiStar, FiEdit, FiMessageSquare, FiClock } from 'react-icons/fi';
import Icon from '../components/Icon';
import { motion } from 'framer-motion';

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
  sentimentScore?: number;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('Movie ID is required');
        
        // First try to get the movie by tmdbId
        const movieData = await getMovie(id);
        setMovie(movieData);
        
        if (movieData) {
          // Use the movie's _id to fetch reviews
          const reviewsData = await getReviews({ movieId: movieData._id });
          setReviews(reviewsData.reviews || []);
        }
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError(err instanceof Error ? err.message : 'Failed to load movie');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'Runtime not available';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getSentimentClass = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-8">The movie you're looking for doesn't exist or has been removed.</p>
        <Link to="/movies" className="text-blue-600 hover:underline flex items-center justify-center">
          <Icon icon={FiArrowLeft} size={20} className="mr-2" /> Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link to="/movies" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <Icon icon={FiArrowLeft} size={20} className="mr-2" /> Back to Movies
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={movie.imageUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
              <div className="flex items-center mb-4">
                <span className="text-gray-600 mr-4">{movie.year}</span>
                <span className="flex items-center text-yellow-500">
                  <Icon icon={FiStar} size={20} className="mr-1" />
                  {typeof movie.avgRating === 'number' ? movie.avgRating.toFixed(1) : 'N/A'}
                </span>
                <span className="mx-4 text-gray-400">|</span>
                <span className="flex items-center text-gray-600">
                  <Icon icon={FiClock} size={20} className="mr-1" />
                  {formatRuntime(movie.runtime)}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-gray-600">{movie.genre}</span>
              </div>
              <p className="text-gray-700 mb-6">{movie.description}</p>
              <div className="flex items-center">
                <Icon icon={FiMessageSquare} size={20} className="mr-2 text-gray-600" />
                <span className="text-gray-600">
                  {movie.reviewCount} {movie.reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
              {/* Write a Review Button */}
              <Link
                to={`/review/new?id=${movie.tmdbId}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition mt-4"
              >
                <Icon icon={FiEdit} size={18} className="mr-2" />
                Write a Review
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to review this movie!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{review.userName || 'Anonymous'}</h3>
                      <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="flex items-center text-yellow-500 mr-2">
                        <Icon icon={FiStar} size={16} className="mr-1" />
                        {review.rating}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getSentimentClass(
                          review.sentiment
                        )}`}
                      >
                        {review.sentiment}
                        {typeof review.sentimentScore === 'number' && (
                          <span className="ml-2">({review.sentimentScore}%)</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.reviewText}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail; 