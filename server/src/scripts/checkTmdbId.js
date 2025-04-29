const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movie-reviews';

const MovieSchema = new mongoose.Schema({
  title: String,
  tmdbId: Number,
});
const Movie = mongoose.model('Movie', MovieSchema);

async function checkTmdbId(tmdbId) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    const movie = await Movie.findOne({ tmdbId: Number(tmdbId) });
    if (movie) {
      console.log('Movie found:', movie);
      console.log('Type of tmdbId:', typeof movie.tmdbId);
    } else {
      console.log('No movie found with tmdbId:', tmdbId);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkTmdbId(1003); 