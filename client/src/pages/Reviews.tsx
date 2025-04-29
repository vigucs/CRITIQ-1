import React, { useState, useEffect } from 'react';
import { FiFilter, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from '../components/Icon';
import { getReviews } from '../services/api';

interface Review {
  _id: string;
  movieTitle: string;
  rating: number;
  reviewText: string;
  sentiment: number;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

// Fallback to mock data if API fails
const allMockReviews: Review[] = [
  {
    _id: '1',
    movieTitle: 'Inception',
    rating: 5,
    reviewText: 'A mind-bending journey that makes you question reality. The visual effects are groundbreaking and the story is complex yet engaging.',
    sentiment: 92,
    user: {
      _id: 'user1',
      name: 'John Smith'
    },
    createdAt: '2023-04-12T10:30:00Z'
  },
  {
    _id: '2',
    movieTitle: 'The Dark Knight',
    rating: 5,
    reviewText: 'Heath Ledger\'s Joker performance is legendary. This film transcends the superhero genre and stands as one of the greatest films ever made.',
    sentiment: 95,
    user: {
      _id: 'user2',
      name: 'Sarah Johnson'
    },
    createdAt: '2023-04-10T14:20:00Z'
  },
  {
    _id: '3',
    movieTitle: 'The Shawshank Redemption',
    rating: 5,
    reviewText: 'A powerful story of hope and redemption. The character development and acting are superb, making it a timeless classic.',
    sentiment: 97,
    user: {
      _id: 'user3',
      name: 'Michael Brown'
    },
    createdAt: '2023-04-08T09:15:00Z'
  },
  {
    _id: '4',
    movieTitle: 'Pulp Fiction',
    rating: 4,
    reviewText: 'Tarantino\'s masterpiece with non-linear storytelling and unforgettable characters. The dialogue is incredibly sharp and witty.',
    sentiment: 88,
    user: {
      _id: 'user4',
      name: 'Emily Davis'
    },
    createdAt: '2023-04-05T17:45:00Z'
  },
  {
    _id: '5',
    movieTitle: 'The Godfather',
    rating: 5,
    reviewText: 'A perfect film in every way. The acting, direction, screenplay, and score are all flawless. A true cinematic achievement.',
    sentiment: 96,
    user: {
      _id: 'user5',
      name: 'Robert Wilson'
    },
    createdAt: '2023-04-03T11:10:00Z'
  },
  {
    _id: '6',
    movieTitle: 'Fight Club',
    rating: 4,
    reviewText: 'A brilliant critique of consumer culture with a twist that changes everything. Visually striking and thematically rich.',
    sentiment: 85,
    user: {
      _id: 'user6',
      name: 'Jennifer Lee'
    },
    createdAt: '2023-04-01T13:30:00Z'
  },
  {
    _id: '7',
    movieTitle: 'The Matrix',
    rating: 4,
    reviewText: 'Revolutionary in its visual effects and philosophical themes. The action sequences are still impressive decades later.',
    sentiment: 90,
    user: {
      _id: 'user7',
      name: 'David Martinez'
    },
    createdAt: '2023-03-28T15:20:00Z'
  },
  {
    _id: '8',
    movieTitle: 'Forrest Gump',
    rating: 4,
    reviewText: 'A heartwarming journey through American history with Tom Hanks in one of his best roles. Both funny and touching.',
    sentiment: 94,
    user: {
      _id: 'user8',
      name: 'Amanda Taylor'
    },
    createdAt: '2023-03-25T10:45:00Z'
  },
  {
    _id: '9',
    movieTitle: 'Interstellar',
    rating: 3,
    reviewText: 'Visually stunning with impressive scientific concepts, but the emotional elements sometimes feel forced.',
    sentiment: 75,
    user: {
      _id: 'user9',
      name: 'Thomas Brown'
    },
    createdAt: '2023-03-20T14:15:00Z'
  },
  {
    _id: '10',
    movieTitle: 'Tenet',
    rating: 2,
    reviewText: 'Ambitious but convoluted. The sound mixing makes dialogue difficult to understand, and the plot is unnecessarily complex.',
    sentiment: 58,
    user: {
      _id: 'user10',
      name: 'Jessica Miller'
    },
    createdAt: '2023-03-15T09:30:00Z'
  },
  {
    _id: '11',
    movieTitle: 'The Emoji Movie',
    rating: 1,
    reviewText: 'A soulless cash grab with no creativity or imagination. The jokes fall flat and the story is predictable and boring.',
    sentiment: 30,
    user: {
      _id: 'user11',
      name: 'Ryan Clark'
    },
    createdAt: '2023-03-10T16:45:00Z'
  },
  {
    _id: '12',
    movieTitle: 'Morbius',
    rating: 2,
    reviewText: 'A messy, poorly edited superhero film that wastes its potential and source material. The script is incoherent and the effects are subpar.',
    sentiment: 45,
    user: {
      _id: 'user12',
      name: 'Laura Wilson'
    },
    createdAt: '2023-03-05T13:20:00Z'
  }
];

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [useApiData, setUseApiData] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        if (useApiData) {
          // Try to fetch from API
          try {
            // Build query parameters for API
            const params: any = {
              page: currentPage,
              limit: 8
            };
            
            if (filterRating !== null) {
              params.rating = filterRating;
            }
            
            if (filterSentiment !== 'all') {
              params.sentiment = filterSentiment;
            }
            
            // Handle sorting
            let sort = '';
            if (sortBy === 'newest') sort = '-createdAt';
            else if (sortBy === 'oldest') sort = 'createdAt';
            else if (sortBy === 'highest') sort = '-rating';
            else if (sortBy === 'lowest') sort = 'rating';
            
            if (sort) params.sort = sort;
            
            // Call API
            const response = await getReviews(params);
            setReviews(response.reviews);
            setTotalPages(response.pagination.pages);
            setLoading(false);
            return;
          } catch (error) {
            console.error('Error fetching from API, falling back to mock data:', error);
            setUseApiData(false);
          }
        }
        
        // Fall back to mock data filtering if API fails
        let filteredReviews = [...allMockReviews];
        
        // Apply rating filter
        if (filterRating !== null) {
          filteredReviews = filteredReviews.filter(review => review.rating === filterRating);
        }
        
        // Apply sentiment filter
        if (filterSentiment !== 'all') {
          filteredReviews = filteredReviews.filter(review => {
            if (filterSentiment === 'positive') return review.sentiment >= 80;
            if (filterSentiment === 'neutral') return review.sentiment >= 50 && review.sentiment < 80;
            if (filterSentiment === 'negative') return review.sentiment < 50;
            return true;
          });
        }
        
        // Sort reviews
        filteredReviews.sort((a, b) => {
          if (sortBy === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          } else if (sortBy === 'oldest') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          } else if (sortBy === 'highest') {
            return b.rating - a.rating;
          } else if (sortBy === 'lowest') {
            return a.rating - b.rating;
          }
          return 0;
        });
        
        // Paginate results
        const itemsPerPage = 8;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);
        
        // Calculate total pages
        const calculatedTotalPages = Math.ceil(filteredReviews.length / itemsPerPage);
        
        setReviews(paginatedReviews);
        setTotalPages(calculatedTotalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage, filterRating, filterSentiment, sortBy, useApiData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setFilterRating(null);
    setFilterSentiment('all');
    setSortBy('newest');
  };

  const getSentimentClass = (sentiment: number) => {
    if (sentiment >= 80) return 'bg-green-100 text-green-800';
    if (sentiment >= 60) return 'bg-blue-100 text-blue-800';
    if (sentiment >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Community Reviews</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-4">
          <Icon icon={FiFilter} size={18} className="text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select 
              className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterRating === null ? '' : filterRating}
              onChange={(e) => setFilterRating(e.target.value === '' ? null : Number(e.target.value))}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          
          {/* Sentiment Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sentiment</label>
            <select 
              className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
          
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select 
              className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={clearFilters}
          className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
        >
          Clear Filters
        </button>
      </div>
      
      {/* Reviews List */}
      <div className="grid grid-cols-1 gap-6">
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No reviews found matching your criteria.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">{review.movieTitle}</h2>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">By {review.user?.name || 'Anonymous User'}</span>
                      <span>• {formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      <Icon icon={FiStar} size={14} className="mr-1" />
                      <span>{review.rating}/5</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm ${getSentimentClass(review.sentiment)}`}>
                      <span>{review.sentiment}% Positive</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.reviewText}</p>
                <div className="mt-4">
                  <Link 
                    to={`/review/${review._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read full review
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon icon={FiChevronLeft} size={20} />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon icon={FiChevronRight} size={20} />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Reviews; 