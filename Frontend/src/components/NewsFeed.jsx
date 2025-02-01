import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import SkeletonLoader from './SkeletonLoader';

const NewsFeed = ({ news, loading, error }) => {
  const [visibleNews, setVisibleNews] = useState(9);
  const { categoryName } = useParams();

  // Reset visibleNews when category changes
  useEffect(() => {
    setVisibleNews(9);
  }, [categoryName]);

  const handleShowMore = () => {
    setVisibleNews(prev => prev + 6); // Load 6 more items when clicked
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
    return <div className="text-red-500 text-center">Failed to load news. Please try again later.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, visibleNews).map((item, index) => (
          <LazyLoad 
             key={index} 
             height={200} 
             offset={100} 
             once
             placeholder={<SkeletonLoader />}
          >
            <Link
              to={`/news/${index}`}
              className="block bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden transform transition-transform hover:scale-105"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{item.title}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">{item.description}</p>
                <span className="mt-4 inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  {item.source.name}
                </span>
              </div>
            </Link>
          </LazyLoad>
        ))}
      </div>
      
      {/* Show More Button */}
      {visibleNews < news.length && (
        <div className="flex justify-center">
          <button
            onClick={handleShowMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;