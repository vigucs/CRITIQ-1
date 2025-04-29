import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Movie from '../models/Movie';
import Review from '../models/Review';
import mongoose from 'mongoose';
import { PipelineStage } from 'mongoose';

// Get all movies with average ratings and review counts
export const getAllMovies = async (req: AuthRequest, res: Response) => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'movieId',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          reviewCount: { $size: '$reviews' },
          avgRating: { $avg: '$reviews.rating' },
        },
      },
      {
        $project: {
          reviews: 0, // Don't include the full reviews in response
        },
      },
      {
        $sort: { title: 1 as 1 },
      },
    ];

    const movies = await Movie.aggregate(pipeline);
    res.json(movies);
  } catch (error: any) {
    console.error('Error getting movies:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single movie with its reviews
export const getMovie = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const isTmdbRoute = req.originalUrl.includes('/tmdb/');

    let movie;
    if (isTmdbRoute) {
      // Only proceed if id is a valid number
      const tmdbIdNum = Number(id);
      if (isNaN(tmdbIdNum)) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      movie = await Movie.findOne({ tmdbId: tmdbIdNum });
    } else {
      if (mongoose.Types.ObjectId.isValid(id)) {
        movie = await Movie.findById(id);
      }
      if (!movie) {
        movie = await Movie.findOne({ tmdbId: Number(id) });
        if (!movie) {
          movie = await Movie.findOne({ tmdbId: id });
        }
      }
    }

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Error fetching movie' });
  }
};

// Create a new movie
export const createMovie = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create movies' });
    }
    
    const { title, year, genre, imageUrl, description } = req.body;
    
    // Check if movie already exists
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(400).json({ message: 'Movie with this title already exists' });
    }
    
    const movie = await Movie.create({
      title,
      year,
      genre,
      imageUrl,
      description,
    });
    
    res.status(201).json(movie);
  } catch (error: any) {
    console.error('Error creating movie:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.keys(error.errors).reduce((acc: any, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// Update a movie
export const updateMovie = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update movies' });
    }

    const { id } = req.params;
    const { title, year, genre, imageUrl, description } = req.body;
    
    const movie = await Movie.findByIdAndUpdate(
      id,
      { title, year, genre, imageUrl, description },
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (error: any) {
    console.error('Error updating movie:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.keys(error.errors).reduce((acc: any, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// Delete a movie
export const deleteMovie = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete movies' });
    }

    const { id } = req.params;
    
    // Delete movie and all associated reviews
    const movie = await Movie.findByIdAndDelete(id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Delete all reviews for this movie
    await Review.deleteMany({ movieId: id });
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: error.message });
  }
};

// Search movies
export const searchMovies = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const movies = await Movie.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);
    
    res.json(movies);
  } catch (error: any) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: error.message });
  }
}; 