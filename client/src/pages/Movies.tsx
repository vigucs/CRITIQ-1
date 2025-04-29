import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Icon from '../components/Icon';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllMovies } from '../services/api';

interface Movie {
  _id: string;
  title: string;
  imageUrl: string;
  year: string;
  rating: number;
  genre: string;
  description: string;
  tmdbId: string;
  runtime: number;
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedDecade, setSelectedDecade] = useState<string>('');

  // For pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const moviesPerPage = 12;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const moviesData = await getAllMovies();
        setMovies(moviesData);
        setFilteredMovies(moviesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  useEffect(() => {
    let filtered = movies;
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter(movie => 
        movie.genre.includes(selectedGenre)
      );
    }
    
    // Apply decade filter
    if (selectedDecade) {
      const startYear = parseInt(selectedDecade);
      const endYear = startYear + 9;
      filtered = filtered.filter(movie => {
        const movieYear = parseInt(movie.year);
        return movieYear >= startYear && movieYear <= endYear;
      });
    }
    
    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedDecade, movies]);

  // Calculate pagination
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // Get unique genres from all movies
  const allGenres = Array.from(
    new Set(movies.flatMap(movie => movie.genre.split(', ')))
  ).sort();

  // Get available decades
  const decades = Array.from(
    new Set(movies.map(movie => {
      const year = parseInt(movie.year);
      return Math.floor(year / 10) * 10;
    }))
  ).sort((a, b) => b - a);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Movies</h1>
      
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Icon
              icon={FiSearch}
              size={20}
              className="absolute right-3 top-2.5 text-gray-400"
            />
          </div>
          
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genres</option>
            {allGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          
          <select
            value={selectedDecade}
            onChange={(e) => setSelectedDecade(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Decades</option>
            {decades.map((decade) => (
              <option key={decade} value={decade.toString()}>
                {decade}s
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentMovies.map((movie) => (
          <Link
            key={movie._id}
            to={`/movies/${movie.tmdbId}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <div className="relative">
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded">
                  <Icon icon={FiStar} size={16} className="inline mr-1" />
                  {movie.rating.toFixed(1)}
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">{movie.title}</h2>
                <p className="text-gray-600 mb-2">{movie.year}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{movie.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <Icon icon={FiChevronLeft} size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <Icon icon={FiChevronRight} size={20} />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Movies; 