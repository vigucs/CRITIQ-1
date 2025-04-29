const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '../.env' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movie-reviews';

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
    sparse: true,
  },
  runtime: {
    type: Number,
    default: 0,
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

async function importLocalMovies() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop existing collection
    await mongoose.connection.collection('movies').drop().catch(() => {
      console.log('No existing movies collection to drop');
    });
    console.log('Dropped existing movies collection');

    // Read the JSON file
    const moviesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../client/src/data/movies.json'), 'utf8'));

    let totalImported = 0;
    let totalSkipped = 0;

    for (const movie of moviesData) {
      try {
        // Create movie document
        const movieDoc = {
          title: movie.title,
          year: movie.year,
          genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
          imageUrl: movie.image,
          description: movie.description,
          tmdbId: movie.id,
          runtime: movie.runtime || 0,
          rating: movie.rating,
        };
        
        // Save to database
        await Movie.create(movieDoc);
        console.log(`Imported: ${movie.title} (${movie.year})`);
        totalImported++;
      } catch (error) {
        console.error(`Error importing ${movie.title}: ${error.message}`);
        totalSkipped++;
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
importLocalMovies(); 