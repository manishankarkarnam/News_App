import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchResults = () => {
  const location = useLocation();
  const { articles, query } = location.state || { articles: [], query: '' };

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-gray-600 dark:text-gray-400">No results found</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Search Results for "{query}" ({articles.length})
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article._id}
            to={`/news/${article._id}`}
            className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <span className="inline-block px-3 py-1 text-sm text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full mb-2">
                {article.category}
              </span>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                {article.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                {article.content}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchResults;
