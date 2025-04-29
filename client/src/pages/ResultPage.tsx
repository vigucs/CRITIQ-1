import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/Movie';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const results = await searchMovies(query);
        setMovies(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{query}"
      </h1>
      
      {movies.length === 0 ? (
        <p>No movies found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultPage; 