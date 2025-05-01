const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/movie-reviews';

// Sample movies data
const sampleMovies = [
  {
    title: "The Shawshank Redemption",
    year: "1994",
    genre: "Drama",
    imageUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    tmdbId: 278,
    runtime: 142,
    reviewCount: 0,
    avgRating: 0
  },
  {
    title: "The Godfather",
    year: "1972",
    genre: "Crime",
    imageUrl: "https://image.tmdb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    tmdbId: 238,
    runtime: 175,
    reviewCount: 0,
    avgRating: 0
  },
  {
    title: "The Dark Knight",
    year: "2008",
    genre: "Action",
    imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    tmdbId: 155,
    runtime: 152,
    reviewCount: 0,
    avgRating: 0
  }
];

// Import movies
async function importMovies() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Movie = mongoose.model('Movie', {
      title: String,
      year: String,
      genre: String,
      imageUrl: String,
      description: String,
      tmdbId: Number,
      runtime: Number,
      reviewCount: Number,
      avgRating: Number
    });

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Insert sample movies
    await Movie.insertMany(sampleMovies);
    console.log('Imported sample movies');

    // Verify import
    const count = await Movie.countDocuments();
    console.log(`Total movies in database: ${count}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error importing movies:', error);
    process.exit(1);
  }
}

importMovies(); 