import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const listUsers = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movie-reviews';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, { name: 1, email: 1, _id: 1 });
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) [${user._id}]`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

listUsers(); 