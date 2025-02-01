import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiGlobe } from 'react-icons/fi';

const NewsDetail = ({ news }) => {
  const navigate = useNavigate();
  const id = window.location.pathname.split('/').pop();
  const article = news[id];

  if (!article) {
    return <div className="text-red-500 text-center">Article not found.</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 group"
      >
        <FiArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to News</span>
      </button>

      {/* Article Content */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
        {article.urlToImage && (
          <div className="relative h-[400px] w-full">
            <img 
              src={article.urlToImage} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="p-8">
          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            {article.source.name && (
              <div className="flex items-center gap-2">
                <FiGlobe className="w-4 h-4" />
                <span>{article.source.name}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            {article.title}
          </h1>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
              {article.description}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
              {article.content}
            </p>
          </div>
 
          {/* Read More Link */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 active:scale-95"
          >
            Read Full Article
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsDetail;