import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiChevronDown, FiSearch, FiX } from 'react-icons/fi';

const Navbar = ({ darkMode, setDarkMode, setCategory }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCategory, setCurrentCategory] = useState('General');

  const categories = [
    { name: 'General', value: 'general' },
    { name: 'Business', value: 'business' },
    { name: 'Technology', value: 'technology' },
    { name: 'Entertainment', value: 'entertainment' },
    { name: 'Health', value: 'health' },
    { name: 'Science', value: 'science' },
    { name: 'Sports', value: 'sports' }
  ];

  const handleCategoryClick = (categoryName) => {
    setCategory(categoryName);
    setCurrentCategory(categories.find(cat => cat.value === categoryName)?.name || 'General');
    navigate(categoryName === 'general' ? '/' : `/${categoryName}`);
    setIsDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <nav className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center">
        {/* Left Section - Categories Dropdown */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 shadow-sm min-w-[120px] justify-between"
            >
              <span>{currentCategory}</span>
              <FiChevronDown className={`transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <>
                {/* Backdrop overlay */}
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                {/* Dropdown menu */}
                <div className="absolute top-full left-0 mt-2 w-48 rounded-lg shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md py-2 z-50 border border-gray-200 dark:border-gray-700">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleCategoryClick(category.value)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100/90 dark:hover:bg-gray-700/90 text-gray-700 dark:text-gray-200 transition duration-200"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center Logo */}
        <div className="flex-1 text-center">
          <Link 
            to="/" 
            onClick={() => handleCategoryClick('general')} 
            className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer hover:opacity-80 transition duration-300"
          >
            NewsApp
          </Link>
        </div>

        {/* Right Section - Search and Theme Toggle */}
        <div className="flex-1 flex justify-end items-center space-x-4">
          <div className="relative">
            {isSearchOpen ? (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center animate-slideIn">
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news..."
                    className="w-64 px-4 py-2 rounded-l-full border border-r-0 border-gray-300 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-300"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="px-4 py-2 rounded-r-full border border-l-0 border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-500 dark:text-gray-300 transition duration-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <FiX className="w-5 h-5 transform hover:scale-110 transition-transform duration-200" />
                  </button>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition duration-300 cursor-pointer"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-yellow-500 dark:text-blue-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-500 transform hover:rotate-180 cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <FiSun className="w-6 h-6 hover:animate-spin" />
            ) : (
              <FiMoon className="w-6 h-6 hover:animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;