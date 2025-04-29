import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleAuthFailed, setGoogleAuthFailed] = useState(false);
  const navigate = useNavigate();
  const { register, googleLogin, isAuthenticated } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const failed = localStorage.getItem('google_auth_failed') === 'true';
    setGoogleAuthFailed(failed);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('All fields are required');
      }
      
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      console.log('Attempting to register with:', { ...formData, password: '[HIDDEN]' });
      const result = await register(formData.name, formData.email, formData.password);
      console.log('Registration successful, token received:', !!result.token);
      console.log('Registration successful, navigating to dashboard');
      
      // Add a small delay to ensure state updates are complete
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevRegistration = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Using developer registration');
      await register('Developer User', 'dev@example.com', 'password123');
      console.log('Developer registration successful');
      
      // Use setTimeout to ensure state updates are complete
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      console.error('Developer registration error:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      console.log('Google registration successful, credential received');
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google registration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to register with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google registration failed');
    setError('Google registration failed. Please try another method.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>

        {!googleAuthFailed && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
              />
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm font-bold">Quick Access</p>
          <p className="text-gray-600 text-sm mb-2">Use the developer account for testing:</p>
          <button
            onClick={handleDevRegistration}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Use Developer Account'}
          </button>
        </div>

        <div className="text-center">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            Already have an account? Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register; 