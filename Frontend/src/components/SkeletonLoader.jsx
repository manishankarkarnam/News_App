import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl p-6">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
  );
};

export default SkeletonLoader;