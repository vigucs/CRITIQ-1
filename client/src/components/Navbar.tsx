import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiLayout,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiMessageSquare,
} from 'react-icons/fi';
import Icon from './Icon';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActivePath = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-200 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
              >
                CritiQ
              </Link>
            </motion.div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <NavLink
                to="/"
                icon={<Icon icon={FiHome} size={20} />}
                label="Home"
                isActive={isActivePath('/')}
              />
              <NavLink
                to="/movies"
                icon={<Icon icon={FiLayout} size={20} />}
                label="Movies"
                isActive={isActivePath('/movies')}
              />
              <NavLink
                to="/reviews"
                icon={<Icon icon={FiMessageSquare} size={20} />}
                label="Reviews"
                isActive={isActivePath('/reviews')}
              />
              {user && (
                <NavLink
                  to="/dashboard"
                  icon={<Icon icon={FiLayout} size={20} />}
                  label="Dashboard"
                  isActive={isActivePath('/dashboard')}
                />
              )}
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <div className="flex items-center space-x-6">
                <motion.div
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-100"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <span className="text-gray-700">{user?.name || 'User'}</span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  <Icon icon={FiLogOut} size={20} />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Icon icon={FiLogIn} size={20} />
                    <span>Login</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
                  >
                    <Icon icon={FiUserPlus} size={20} />
                    <span>Register</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
