import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Movie } from '../types/Movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { id, title, year, genre, image, description } = movie;
  
  // Default image if none is provided
  const defaultImage = 'https://via.placeholder.com/300x450?text=No+Image';
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <Link to={`/movies/${id}`}>
        <div className="relative pb-[150%]">
          <img 
            src={image || defaultImage} 
            alt={`${title} poster`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{title}</h3>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">{year}</span>
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-full">
              {genre?.[0] || 'Unknown'}
            </span>
          </div>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard; 