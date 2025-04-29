export interface Movie {
  id: string;
  title: string;
  image: string;
  year: string;
  rating: number;
  genre?: string[];
  description?: string;
} 