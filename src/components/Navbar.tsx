import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, User, LogOut } from 'lucide-react';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (isAuthenticated) {
      fetch('http://localhost:5000/api/users/profile', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(res => res.json())
        .then(data => setProfile(data.profile || data.user || null));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
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
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    className="flex items-center space-x-2 px-2 py-1 rounded-full hover:bg-white/10 transition-all duration-300 focus:outline-none"
                  >
                    <img
                      src={profile?.profile_picture || DEFAULT_AVATAR}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-blue-400"
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                      >
                        View Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => { setDropdownOpen(false); navigate('/profile/edit'); }}
                      >
                        Edit Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
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