import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Brain className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
            <span className="text-xl font-bold gradient-text">AI Resume Builder</span>
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    location.pathname === '/dashboard' 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/resume-builder" 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    location.pathname === '/resume-builder' 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  Resume Builder
                </Link>
                <Link 
                  to="/jobs" 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    location.pathname === '/jobs' 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  Jobs
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-600/20 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;