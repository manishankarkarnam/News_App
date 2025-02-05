// src/components/ArticleDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';

const ArticleDetail = ({ articles }) => {
  const { id } = useParams(); 
  const article = articles[id];
 
  if (!article) return <p>Article not found</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <img
        src={article.image || 'https://via.placeholder.com/600x400'}
        alt={article.title}
        className="w-full h-96 object-cover mb-4"
      />
      <p className="text-gray-700">{article.content}</p>
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        Read more on source website
      </a>
    </div>
  );
};

export default ArticleDetail;