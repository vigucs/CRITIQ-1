import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReviewPage from './pages/ReviewPage';
import NewReviewPage from './pages/NewReviewPage';
import ResultPage from './pages/ResultPage';
import Movies from './pages/Movies';
import Reviews from './pages/Reviews';
import MovieDetail from './pages/MovieDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/results" element={<ResultPage />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review/new"
              element={
                <ProtectedRoute>
                  <NewReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review/:id"
              element={
                <ProtectedRoute>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 