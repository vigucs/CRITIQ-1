import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { FiStar, FiClock, FiArrowLeft, FiEdit, FiMessageSquare } from 'react-icons/fi';
import { AiFillHeart, AiOutlineShareAlt } from 'react-icons/ai';
import LoadingSpinner from '../components/LoadingSpinner';
import { movieDatabase } from '../data/movieDatabase';
import { getReviews } from '../services/api';
import { Review } from '../types/api';

interface Movie {
  id: string;
  title: string;
  image: string;
  year: string;
  rating: number;
  genre?: string[];
  description?: string;
}

interface ReviewStats {
  averageRating: number;
  ratingCount: number;
  sentimentPercentages: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error('Movie ID is required');
        }

        // Find the movie from our database using the ID parameter
        const foundMovie = movieDatabase.find(movie => movie.id === id);
        
        if (!foundMovie) {
          throw new Error(`Movie with ID ${id} not found`);
        }

        setMovie(foundMovie);
        
        // Fetch reviews from API
        const response = await getReviews({ movieId: id });
        if (response.reviews) {
          setReviews(response.reviews);
        }
        if (response.stats) {
          setStats(response.stats);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getSentimentClass = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'neutral':
        return 'bg-blue-100 text-blue-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentPercentage = (sentiment: string) => {
    if (!stats?.sentimentPercentages) return 0;
    const percentage = stats.sentimentPercentages[sentiment.toLowerCase() as keyof typeof stats.sentimentPercentages];
    return percentage || 0;
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, we would save this to the user's favorites in the database
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Error</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link to="/movies" className="text-blue-600 hover:underline flex items-center justify-center">
          <Icon icon={FiArrowLeft} size={20} className="mr-2" /> Back to Movies
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Movie Not Found</h1>
        <p className="text-gray-600 mb-8">The movie you're looking for doesn't exist or has been removed.</p>
        <Link to="/movies" className="text-blue-600 hover:underline flex items-center justify-center">
          <Icon icon={FiArrowLeft} size={20} className="mr-2" /> Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Backdrop Header */}
      <div 
        className="relative h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end px-4 py-12 sm:px-6 lg:px-8 container mx-auto">
          <div className="flex flex-col md:flex-row items-end md:items-end gap-6">
            <img 
              src={movie.image} 
              alt={movie.title} 
              className="w-36 h-auto rounded-lg shadow-lg border-4 border-white relative z-10 hidden md:block" 
            />
            <div className="relative z-10 text-white">
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span>{movie.year}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Icon icon={FiStar} size={16} className="mr-1 text-yellow-400" />
                  <span>{stats?.averageRating || movie.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>{stats?.ratingCount || 0} reviews</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {movie.genre?.map((genre, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-800/70 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{movie.description || 'No description available.'}</p>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
                <Link 
                  to={`/review/new?movieId=${movie.id}&movieTitle=${movie.title}`}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  <Icon icon={FiMessageSquare} size={18} className="mr-2" />
                  Write a Review
                </Link>
              </div>

              {reviews.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Icon icon={FiMessageSquare} size={36} className="mx-auto text-gray-400 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to share your thoughts on this movie!</p>
                  <Link 
                    to={`/review/new?movieId=${movie.id}&movieTitle=${movie.title}`}
                    className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Write a Review
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {review.user?.name ? review.user.name[0] : 'A'}
                          </div>
                          <div className="ml-3">
                            <div className="font-semibold text-gray-800">{review.user?.name || 'Anonymous User'}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Icon icon={FiClock} size={14} className="mr-1" />
                              {formatDate(review.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            <Icon icon={FiStar} size={14} className="mr-1" />
                            <span>{review.rating}/5</span>
                          </div>
                          <div className={`px-2 py-1 rounded text-sm ${getSentimentClass(review.sentiment)}`}>
                            <span>{getSentimentPercentage(review.sentiment)}% {review.sentiment}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.reviewText}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Movie Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500">Release Year:</span>
                  <span className="block text-gray-800 font-medium">{movie.year}</span>
                </div>
                <div>
                  <span className="text-gray-500">User Rating:</span>
                  <div className="flex items-center mt-1">
                    <Icon icon={FiStar} size={16} className="text-yellow-400 mr-1" />
                    <span className="text-gray-800 font-medium">{stats?.averageRating || movie.rating.toFixed(1)}/10</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Total Reviews:</span>
                  <span className="block text-gray-800 font-medium">{stats?.ratingCount || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500">Sentiment Analysis:</span>
                  <div className="mt-2 space-y-2">
                    {stats?.sentimentPercentages && Object.entries(stats.sentimentPercentages).map(([sentiment, percentage]) => (
                      <div key={sentiment} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{sentiment}:</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${getSentimentClass(sentiment)}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-10 text-right">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Genres:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {movie.genre?.map((genre, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={handleFavorite}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition ${
                    isFavorite
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon icon={AiFillHeart} size={18} className="mr-2" />
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </button>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition w-full mb-4">
                <Icon icon={AiOutlineShareAlt} size={18} className="mr-2" />
                <span>Share</span>
              </button>
              <Link 
                to="/movies"
                className="block w-full py-2 bg-white text-blue-700 rounded-lg text-center font-medium hover:bg-blue-50 transition"
              >
                <Icon icon={FiStar} size={18} className="inline mr-2" />
                Discover More Movies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 