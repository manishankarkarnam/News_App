// src/components/NewsList.js
import React from 'react';
import { Link } from 'react-router-dom';

const NewsList = ({ articles, loading, error }) => {
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article, index) => (
        <Link
          key={index}
          to={`/article/${index}`}
          className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
        >
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <span className="text-gray-500">Image Source Not Available</span>
            </div>
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-600">{article.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NewsList;