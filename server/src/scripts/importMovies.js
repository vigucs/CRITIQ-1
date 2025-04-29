/**
 * Movie Import Script
 * 
 * This script imports popular movies from the TMDB API to populate our database.
 * Usage: node importMovies.js
 * 
 * You'll need to set the TMDB_API_KEY environment variable or modify this script.
 */

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movie-reviews';

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'YOUR_TMDB_API_KEY'; // Replace with your API key if not using env var
const TMDB_API_URL = 'https://api.themoviedb.org/3';

// Define Movie schema
const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
  },
  year: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  tmdbId: {
    type: Number,
    unique: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Movie = mongoose.model('Movie', MovieSchema);

// Function to fetch genres from TMDB
async function fetchGenres() {
  try {
    const response = await axios.get(`${TMDB_API_URL}/genre/movie/list`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    return response.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching genres:', error.message);
    return {};
  }
}

// Function to fetch and import movies
async function importMovies() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fetch genres first
    const genres = await fetchGenres();
    console.log(`Fetched ${Object.keys(genres).length} genres`);

    // Number of pages to import (each page has 20 movies)
    const pagesToImport = 5;
    let totalImported = 0;
    let totalSkipped = 0;

    // Import popular movies from multiple pages
    for (let page = 1; page <= pagesToImport; page++) {
      console.log(`Fetching page ${page} of ${pagesToImport}...`);
      
      const response = await axios.get(`${TMDB_API_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
        },
      });
      
      const movies = response.data.results;
      
      for (const movie of movies) {
        try {
          // Format genres
          const movieGenres = movie.genre_ids
            .map(id => genres[id])
            .filter(Boolean)
            .join(', ');
          
          // Extract year from release date
          const year = movie.release_date ? movie.release_date.substring(0, 4) : 'Unknown';
          
          // Create movie document
          const movieDoc = {
            title: movie.title,
            year,
            genre: movieGenres || 'Uncategorized',
            imageUrl: movie.poster_path ? 
              `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 
              'https://via.placeholder.com/500x750?text=No+Image',
            description: movie.overview || 'No description available',
            tmdbId: movie.id,
            rating: movie.vote_average,
          };
          
          // Check if movie already exists
          const existingMovie = await Movie.findOne({ tmdbId: movie.id });
          
          if (existingMovie) {
            console.log(`Skipping "${movie.title}" - already exists`);
            totalSkipped++;
            continue;
          }
          
          // Save to database
          await Movie.create(movieDoc);
          console.log(`Imported: ${movie.title} (${year})`);
          totalImported++;
        } catch (error) {
          console.error(`Error importing ${movie.title}: ${error.message}`);
          totalSkipped++;
        }
      }
    }
    
    console.log(`Import complete! Imported ${totalImported} movies, skipped ${totalSkipped} movies.`);
  } catch (error) {
    console.error('Import failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the import
importMovies(); 