import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import SkeletonLoader from './SkeletonLoader';
import { motion } from 'framer-motion';

const NewsFeed = ({ news, loading, error }) => {
  const [visibleNews, setVisibleNews] = useState(12);
  const loadingRef = useRef(null);
  const { categoryName } = useParams();

  // Reset visibleNews when category changes
  useEffect(() => {
    setVisibleNews(12);
  }, [categoryName]);

  // Implement infinite scroll
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && visibleNews < news.length) {
      setVisibleNews(prev => prev + 6);
    }
  }, [visibleNews, news.length]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loadingRef.current) observer.observe(loadingRef.current);
    
    return () => {
      if (loadingRef.current) observer.unobserve(loadingRef.current);
    };
  }, [handleObserver]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, index) => (
          <SkeletonLoader key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-xl mb-4">Failed to load news. Please try again later.</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return <div className="text-center">No news articles found.</div>;
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, visibleNews).map((item) => (
          <LazyLoad 
             key={item._id}  // Change key to use _id
             height={200} 
             offset={100} 
             once
             placeholder={<SkeletonLoader />}
          >
            <motion.div
              variants={item}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/news/${item._id}`}  // Update link to use _id
                className="block bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden transform transition-transform hover:scale-105"
              >
                {/* Image Section */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <span className="text-gray-500">Image Not Available</span>
                  </div>
                )}
                <div className="p-4">
                  {/* Category Tag */}
                  <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full mb-2">
                    {item.category}
                  </span>
                  {/* Headline */}
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
                    {item.title}
                  </h2>
                  {/* Published date and time */}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.publishedAt).toLocaleString()}
                  </p>
                </div>
              </Link>
            </motion.div>
          </LazyLoad>
        ))}
      </motion.div>
      
      {/* Loading indicator */}
      {visibleNews < news.length && (
        <div ref={loadingRef} className="flex justify-center py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
};

export default NewsFeed;