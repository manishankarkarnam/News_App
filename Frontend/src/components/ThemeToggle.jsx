import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  return (
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
  );
};

export default ThemeToggle;
