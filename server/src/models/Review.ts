import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  movieTitle: string;
  movieId: string;
  reviewText: string;
  rating: number;
  sentiment: string;
  sentimentScore: number;
  userId: mongoose.Types.ObjectId;
}

const ReviewSchema = new Schema<IReview>(
  {
    movieTitle: {
      type: String,
      required: [true, 'Please provide a movie title'],
      maxlength: [100, 'Movie title cannot be more than 100 characters'],
    },
    movieId: {
      type: String,
      required: [true, 'Please provide a movie ID'],
    },
    reviewText: {
      type: String,
      required: [true, 'Please provide a review text'],
      minlength: [10, 'Review text must be at least 10 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    sentiment: {
      type: String,
      required: [true, 'Please provide a sentiment'],
      enum: ['positive', 'negative', 'neutral'],
    },
    sentimentScore: {
      type: Number,
      required: false,
      min: 0,
      max: 100,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema); 