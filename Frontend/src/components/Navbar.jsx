import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ darkMode, setDarkMode, setCategory }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('news');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { name: 'News', value: 'news' },
    { name: 'Technology', value: 'technology' },
    { name: 'Business', value: 'business' },
    { name: 'Finance', value: 'finance' },
    { name: 'Science', value: 'science' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setSearchQuery('');
  };

  const handleSearchIconClick = () => {
    handleSearchSubmit({ preventDefault: () => {} });
  };

  return (
    <nav className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg shadow-md sticky top-0 z-50">
      {/* First Row - Logo and Theme Toggle */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1" /> {/* Spacer */}
          <div className="text-3xl font-bold text-gray-800 dark:text-white text-center">
            NewsApp
          </div>
          <div className="flex-1 flex justify-end">
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>
      </div>

      {/* Second Row - Categories and Search */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between space-x-4">
            {/* Categories - Desktop */}
            <div className="hidden md:flex items-center space-x-4 overflow-x-auto no-scrollbar">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    setCategory(category.value);
                    setActiveCategory(category.value);
                    navigate(category.value === 'news' ? '/' : `/${category.value}`);
                  }}
                  className={`px-4 py-1 rounded-full text-sm whitespace-nowrap transition-colors duration-200 cursor-pointer
                    ${(activeCategory === category.value || (category.value === 'news' && window.location.pathname === '/'))
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Categories - Mobile Dropdown */}
            <div className="relative md:hidden" ref={mobileMenuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
              >
                <span>{categories.find(cat => cat.value === activeCategory)?.name || 'Select Category'}</span>
                <FiChevronDown className={`transform transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileMenuOpen && (
                <div className="absolute mt-2 py-2 w-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        setCategory(category.value);
                        setActiveCategory(category.value);
                        navigate(category.value === 'news' ? '/' : `/${category.value}`);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 transition-colors duration-200
                        ${activeCategory === category.value 
                          ? 'bg-blue-500 text-white' 
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(e);
                  }
                }}
                placeholder="Search news..."
                className="w-full px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSearchIconClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer group"
              >
                <FiSearch className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;