import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movie-reviews';
    console.log('Attempting to connect to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error: any) {
    console.error('MongoDB connection error details:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    process.exit(1);
  }
};

export default connectDB; 