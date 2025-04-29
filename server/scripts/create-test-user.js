const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const URI = 'mongodb://127.0.0.1:27017/movie-reviews';
const SALT_ROUNDS = 10;

async function createTestUser() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(URI);
    console.log('Connected to MongoDB');

    // Define User schema and model
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    
    const User = mongoose.model('User', UserSchema);
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }
    
    // Create test user
    console.log('Creating test user...');
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });
    
    await testUser.save();
    console.log('Test user created successfully');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
createTestUser(); 