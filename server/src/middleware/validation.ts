import { Request, Response, NextFunction } from 'express';

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
  const { movieId, movieTitle, reviewText, rating } = req.body;

  const errors = [];

  if (!movieId || typeof movieId !== 'string' || movieId.trim().length === 0) {
    errors.push('Movie ID is required');
  }

  if (!movieTitle || typeof movieTitle !== 'string' || movieTitle.trim().length < 1) {
    errors.push('Movie title is required');
  }

  if (!reviewText || typeof reviewText !== 'string' || reviewText.trim().length < 10) {
    errors.push('Review text must be at least 10 characters long');
  }

  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    errors.push('Rating must be a number between 1 and 5');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  // Sanitize input
  req.body.movieId = movieId.trim();
  req.body.movieTitle = movieTitle.trim();
  req.body.reviewText = reviewText.trim();
  req.body.rating = Math.round(rating);

  next();
};

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Valid email is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  // Sanitize input
  req.body.name = name.trim();
  req.body.email = email.toLowerCase().trim();

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const errors = [];

  if (!email || typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Valid email is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  // Sanitize input
  req.body.email = email.toLowerCase().trim();

  next();
}; 