import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiSearch, FiX, FiChevronDown } from 'react-icons/fi';

const Navbar = ({ darkMode, setDarkMode, setCategory }) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { name: 'General', value: 'general' },
    { name: 'Business', value: 'business' },
    { name: 'Technology', value: 'technology' },
    { name: 'Entertainment', value: 'entertainment' },
    { name: 'Health', value: 'health' },
    { name: 'Science', value: 'science' },
    { name: 'Sports', value: 'sports' }
  ];

  const countries = [
    { name: 'All', value: 'all' },
    { name: 'United States', value: 'us' },
    { name: 'United Kingdom', value: 'gb' },
    { name: 'India', value: 'in' },
    { name: 'Canada', value: 'ca' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setSearchQuery('');
    setIsSearchOpen(false);
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
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-yellow-500 dark:text-blue-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-500 transform hover:rotate-180"
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
      </div>

      {/* Second Row - Categories, Search, and Country Selector */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between space-x-4">
            {/* Categories */}
            <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    setCategory(category.value);
                    navigate(category.value === 'general' ? '/' : `/${category.value}`);
                  }}
                  className="px-3 py-0.5 rounded-full text-sm whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search and Country Selector */}
            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <div className="relative">
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
                  className="w-48 px-4 py-1 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSearchIconClick}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer group"
                >
                  <FiSearch className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </button>
              </div>

              {/* Country Selector */}
              <div className="relative" ref={countryDropdownRef}>
                <button
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                >
                  <span>Select Country</span>
                  <FiChevronDown className={`transform transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCountryDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    {countries.map((country) => (
                      <button
                        key={country.value}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                      >
                        {country.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;