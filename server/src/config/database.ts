import mongoose from 'mongoose';

const connectDB = async () => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds
  let retryCount = 0;

  const tryConnect = async () => {
    try {
      // Always use the container name in Docker environment
      const mongoURI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/movie-reviews';
      
      console.log('Attempting to connect to MongoDB at:', mongoURI);
      console.log('Environment:', process.env.DOCKER_ENV ? 'Docker' : 'Local');
      console.log('Attempt:', retryCount + 1, 'of', maxRetries);
      
      // Configure mongoose with better options
      mongoose.set('strictQuery', false);
      mongoose.set('bufferCommands', true);
      
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Force IPv4
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
        w: 'majority'
      });
      
      console.log('MongoDB connected successfully');
      
      // Test database operations
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
      
      // Set up event handlers
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });

      return true;
    } catch (error: any) {
      console.error('MongoDB connection error details:', {
        message: error.message,
        code: error.code,
        name: error.name,
        attempt: retryCount + 1,
        stack: error.stack
      });
      return false;
    }
  };

  while (retryCount < maxRetries) {
    if (await tryConnect()) {
      return;
    }
    retryCount++;
    if (retryCount < maxRetries) {
      console.log(`Retrying in ${retryDelay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  console.error('Failed to connect to MongoDB after', maxRetries, 'attempts');
  process.exit(1);
};

export default connectDB; 