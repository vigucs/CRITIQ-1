export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Review {
  id: string;
  _id: string;
  movieId: string;
  movieTitle: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
  reviewText: string;
  rating: number;
  sentiment: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SentimentAnalysis {
  score: number;
  label: string;
}

export interface Stats {
  totalReviews: number;
  averageRating: number;
  sentimentPercentages: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentReviews: Review[];
  monthlyStats: {
    month: string;
    count: number;
  }[];
}

export interface ApiError {
  message: string;
  status?: number;
} 