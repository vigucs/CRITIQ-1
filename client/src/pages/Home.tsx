import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiStar, FiClock, FiFilter, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import Icon from '../components/Icon';
import { movieDatabase, getRecentMovies, getTopRatedMovies, getMoviesByYear, getMoviesByGenre } from '../data/movieDatabase';
import { Movie } from '../types/Movie';

const Home: React.FC = () => {
  // State for various movie categories
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [classicMovies, setClassicMovies] = useState<Movie[]>([]);
  
  // State for decade filtering
  const [selectedDecade, setSelectedDecade] = useState<string>('all');
  const [decadeMovies, setDecadeMovies] = useState<Movie[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;
  
  useEffect(() => {
    // Initialize different movie sections
    setFeaturedMovies(movieDatabase.slice(0, 16));
    setTopRatedMovies(getTopRatedMovies(12));
    setRecentMovies(getRecentMovies(8));
    setClassicMovies(getMoviesByYear(2000, 2010).slice(0, 8));
    
    // Initial decade display shows all movies
    setDecadeMovies(movieDatabase);
  }, []);
  
  // Change decade handler
  const handleDecadeChange = (decade: string) => {
    setSelectedDecade(decade);
    setCurrentPage(1);
    
    if (decade === 'all') {
      setDecadeMovies(movieDatabase);
    } else {
      const [start, end] = decade.split('-').map(year => parseInt(year));
      setDecadeMovies(getMoviesByYear(start, end));
    }
  };
  
  // Calculate pagination
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = decadeMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(decadeMovies.length / moviesPerPage);
  
  // Recent reviews (mock data)
  const recentReviews = [
    {
      id: '101',
      movieTitle: 'Inception',
      movieId: '1020',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      userName: 'John Smith',
      rating: 4.5,
      content: 'A mind-bending journey that makes you question reality. The visual effects are groundbreaking and the story is complex yet engaging.',
      date: '2 days ago'
    },
    {
      id: '102',
      movieTitle: 'The Dark Knight',
      movieId: '1022',
      userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      userName: 'Sarah Johnson',
      rating: 5,
      content: 'Heath Ledger\'s Joker performance is legendary. This film transcends the superhero genre and stands as one of the greatest films ever made.',
      date: '1 week ago'
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Discover & Share Movie Reviews</h1>
            <p className="text-xl mb-8">
              Find your next favorite film with our community-driven movie reviews. Over {movieDatabase.length} movies from 2000-2025 available to review.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/movies" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition flex items-center"
              >
                <Icon icon={FiPlay} size={20} className="mr-2" /> Browse Movies
              </Link>
              <Link 
                to="/register" 
                className="bg-transparent hover:bg-white/10 border border-white text-white font-medium py-3 px-6 rounded-lg transition flex items-center"
              >
                <Icon icon={FiStar} size={20} className="mr-2" /> Write a Review
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-16 container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Movies</h2>
          <Link to="/movies" className="text-blue-600 hover:underline flex items-center">
            View All <Icon icon={FiChevronRight} size={20} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredMovies.slice(0, 8).map(movie => (
            <Link 
              key={movie.id}
              to={`/movies/${movie.id}`} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative h-64">
                <img 
                  src={movie.image} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full px-2 py-1 text-sm flex items-center">
                  <Icon icon={FiStar} size={16} className="mr-1" />
                  {movie.rating}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl mb-1 text-gray-800">{movie.title}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">{movie.year}</p>
                  {movie.genre && movie.genre.length > 0 && <p className="text-gray-500 text-sm">{movie.genre[0]}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Recent Reviews</h2>
            <Link to="/reviews" className="text-blue-600 hover:underline flex items-center">
              View All <Icon icon={FiClock} size={20} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recentReviews.map(review => (
              <div key={review.id} className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <img 
                    src={review.userAvatar} 
                    alt={review.userName} 
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{review.userName}</h3>
                        <Link to={`/movies/${review.movieId}`} className="text-blue-600 hover:underline">
                          {review.movieTitle}
                        </Link>
                      </div>
                      <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        <Icon icon={FiStar} size={16} className="mr-1" />
                        <span>{review.rating}/5</span>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700">{review.content}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      {review.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition inline-block"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      {/* Browse By Decade Section */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Browse Movies By Decade</h2>
        
        {/* Decade selection tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button 
            onClick={() => handleDecadeChange('all')}
            className={`px-4 py-2 rounded-full ${selectedDecade === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            All
          </button>
          <button 
            onClick={() => handleDecadeChange('2020-2025')}
            className={`px-4 py-2 rounded-full ${selectedDecade === '2020-2025' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            2020s
          </button>
          <button 
            onClick={() => handleDecadeChange('2010-2019')}
            className={`px-4 py-2 rounded-full ${selectedDecade === '2010-2019' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            2010s
          </button>
          <button 
            onClick={() => handleDecadeChange('2000-2009')}
            className={`px-4 py-2 rounded-full ${selectedDecade === '2000-2009' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            2000s
          </button>
        </div>
        
        {/* Movies grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentMovies.map(movie => (
            <Link 
              key={movie.id}
              to={`/movies/${movie.id}`} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative h-64">
                <img 
                  src={movie.image} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full px-2 py-1 text-sm flex items-center">
                  <Icon icon={FiStar} size={16} className="mr-1" />
                  {movie.rating}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl mb-1 text-gray-800">{movie.title}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">{movie.year}</p>
                  {movie.genre && movie.genre.length > 0 && <p className="text-gray-500 text-sm">{movie.genre[0]}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`mr-2 p-2 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white'}`}
            >
              <Icon icon={FiChevronLeft} size={24} />
            </button>
            <div className="flex items-center mx-4">
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`ml-2 p-2 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white'}`}
            >
              <Icon icon={FiChevronRight} size={24} />
            </button>
          </div>
        )}
      </section>

      {/* Browse by Genre */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Browse by Genre</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Action', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
              { name: 'Drama', image: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg' },
              { name: 'Sci-Fi', image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
              { name: 'Comedy', image: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg' },
              { name: 'Horror', image: 'https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg' },
              { name: 'Animation', image: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg' },
              { name: 'Thriller', image: 'https://image.tmdb.org/t/p/w500/8kNruSfhk5IoE4eZOc4UpvDn6tq.jpg' },
              { name: 'Crime', image: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg' }
            ].map(genre => (
              <Link 
                key={genre.name}
                to={`/movies?genre=${genre.name}`}
                className="relative overflow-hidden rounded-lg group h-40"
              >
                <img 
                  src={genre.image} 
                  alt={genre.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-60 transition"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{genre.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Movie Review App?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <Icon icon={FiStar} size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Discover Great Films</h3>
            <p className="text-gray-600">
              Browse our collection of {movieDatabase.length}+ movies from 2000-2025 and find your next favorite.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <Icon icon={FiStar} size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sentiment Analysis</h3>
            <p className="text-gray-600">
              Our AI-powered sentiment analysis helps you understand the emotional impact of each film.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <Icon icon={FiClock} size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Stay Updated</h3>
            <p className="text-gray-600">
              Get notified about new releases and trending discussions in the world of cinema.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
