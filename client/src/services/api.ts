import axios, { AxiosError } from 'axios';

// Define the error response type
interface ApiErrorResponse {
  message: string;
}

interface Review {
  _id: string;
  movieId: string;
  movieTitle: string;
  reviewText: string;
  rating: number;
  sentiment: string;
  sentimentScore?: number;
  createdAt: string;
  userName?: string;
}

interface Movie {
  _id: string;
  title: string;
  year: string;
  genre: string;
  imageUrl: string;
  description: string;
  tmdbId: string;
  runtime: number;
  reviewCount: number;
  avgRating: number;
  reviews: Review[];
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const ML_API_URL = process.env.REACT_APP_ML_API_URL || 'http://localhost:5500';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-error'));
      throw new Error('Session expired. Please log in again.');
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
);

// Auth API
export const login = async (email: string, password: string) => {
  const response = await api.post<{ token: string; user: any }>('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post<{ token: string; user: any }>('/auth/register', {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Users API
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

// Movies API
export const getAllMovies = async () => {
  const response = await api.get('/movies');
  return response.data;
};

export const getMovie = async (id: string): Promise<Movie> => {
  // If id is a number, try tmdb route first
  if (!isNaN(Number(id))) {
    try {
      const response = await api.get(`/movies/tmdb/${id}`);
      return response.data;
    } catch (error) {
      // fallback below
    }
  }
  // Otherwise, or if tmdb route fails, try by ObjectId
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const searchMovies = async (query: string) => {
  const response = await api.get(`/movies/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

// Reviews API
export const createReview = async (review: {
  movieId: string;
  movieTitle: string;
  reviewText: string;
  rating: number;
}) => {
  const response = await api.post('/reviews', review);
  return response.data;
};

export const getReviews = async (params: {
  page?: number;
  limit?: number;
  movieId?: string;
  userId?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.movieId) queryParams.append('movieId', params.movieId);
  if (params.userId) queryParams.append('userId', params.userId);

  const response = await api.get(`/reviews?${queryParams.toString()}`);
  return {
    reviews: response.data.reviews || [],
    stats: response.data.stats || null,
    pagination: {
      pages: response.data.pagination?.pages || 1
    }
  };
};

export const getReview = async (id: string) => {
  const response = await api.get(`/reviews/${id}`);
  return response.data;
};

// Stats API
export const getStats = async () => {
  const response = await api.get('/reviews/stats');
  return response.data;
};

export const getUserStats = async (userId: string) => {
  const response = await api.get(`/reviews/stats/user/${userId}`);
  return response.data;
};

// Utility functions
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default api; 