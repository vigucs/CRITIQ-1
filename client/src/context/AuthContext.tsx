import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register, getCurrentUser, isAuthenticated, logout } from '../services/api';
import { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ token: string; user: User }>;
  register: (name: string, email: string, password: string) => Promise<{ token: string; user: User }>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const handleLogin = async (email: string, password: string) => {
    const { token, user } = await login(email, password);
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return { token, user };
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });
      
      if (!response.ok) {
        throw new Error('Google authentication failed');
      }

      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const { token, user } = await register(name, email, password);
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return { token, user };
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        googleLogin: handleGoogleLogin,
        logout: handleLogout,
        isAuthenticated: !!token,
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 