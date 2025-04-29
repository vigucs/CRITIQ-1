import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  year: string;
  genre: string;
  imageUrl?: string;
  description?: string;
  runtime?: number;
  tmdbId?: number;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      maxlength: [100, 'Movie title cannot be more than 100 characters'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Please provide a release year'],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Please provide a genre'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    runtime: {
      type: Number,
      default: 0,
    },
    tmdbId: {
      type: Number,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Create index for faster searching
MovieSchema.index({ title: 'text' });

export default mongoose.model<IMovie>('Movie', MovieSchema); 