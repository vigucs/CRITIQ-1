import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import routes from './routes';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins in development
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Dev-Mode');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    name: err.name
  });
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Check if we have DEV_MODE environment variable set
const isDevMode = process.env.DEV_MODE === 'true';

// Connect to MongoDB only if not in dev mode
if (isDevMode) {
  console.log('Starting server in DEV MODE - skipping MongoDB connection');
  app.listen(PORT, () => {
    console.log(`Server is running in DEV MODE on port ${PORT}`);
    console.log(`API is available at http://localhost:${PORT}/api`);
  });
} else {
  // Regular MongoDB connection
  console.log('Attempting to connect to MongoDB at:', process.env.MONGODB_URI);
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movie-reviews')
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`API is available at http://localhost:${PORT}/api`);
      });
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      console.log('Starting server without MongoDB connection...');
      // Start server anyway to allow some functionality to work
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}, but without database connection`);
        console.log(`API is available at http://localhost:${PORT}/api`);
        console.log('Note: Some functionality requiring database access will not work!');
      });
    });
} 