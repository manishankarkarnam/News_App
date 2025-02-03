import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiGlobe } from 'react-icons/fi';
import { ChevronUp, ChevronDown, Share2, Copy } from 'lucide-react'; // updated import

// Mock related articles data for demonstration
const relatedArticles = [
  {
    id: 1,
    title: "NASA Announces New Mars Mission Timeline",
    snippet: "The space agency reveals ambitious plans for upcoming Mars exploration...",
    category: "Space",
    date: "February 2, 2025",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/000/608/951/original/vector-breaking-news-background-concept-series-03.jpg"
  },
  {
    id: 2,
    title: "Breakthrough in Quantum Computing Achieved",
    snippet: "Scientists report major advancement in quantum processing capabilities...",
    category: "Technology",
    date: "February 1, 2025",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/000/608/951/original/vector-breaking-news-background-concept-series-03.jpg"
  },
  {
    id: 3,
    title: "New Satellite Internet Service Launches Beta",
    snippet: "Global internet provider begins testing revolutionary satellite service...",
    category: "Technology",
    date: "January 31, 2025",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/000/608/951/original/vector-breaking-news-background-concept-series-03.jpg"
  },
  {
    id: 4,
    title: "Space Tourism Company Announces First Commercial Flight",
    snippet: "Private space company set to make history with civilian space travel...",
    category: "Space",
    date: "January 30, 2025",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/000/608/951/original/vector-breaking-news-background-concept-series-03.jpg"
  },
  {
    id: 5,
    title: "Innovative AI Startup Disrupts Tech Industry",
    snippet: "A new AI startup is changing the way businesses operate...",
    category: "Technology",
    date: "January 29, 2025",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/000/608/951/original/vector-breaking-news-background-concept-series-03.jpg"
  },
  {
    id: 6,
    title: "Global Markets Rally Amid Optimism",
    snippet: "Financial markets around the world see a surge amid mixed signals...",
    category: "Finance",
    date: "January 28, 2025",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/000/608/951/original/vector-breaking-news-background-concept-series-03.jpg"
  },
  {
    id: 7,
    title: "New Breakthrough in Renewable Energy Technology",
    snippet: "Engineers reveal a surprising new method to harness solar power...",
    category: "Science",
    date: "January 27, 2025",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/000/608/951/original/vector-breaking-news-background-concept-series-03.jpg"
  },
  {
    id: 8,
    title: "Tech Giants Join Forces for New Initiative",
    snippet: "Leading tech companies announce a joint venture to innovate...",
    category: "Business",
    date: "January 26, 2025",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/000/608/951/original/vector-breaking-news-background-concept-series-03.jpg"
  },
  {
    id: 9,
    title: "Emerging Robotics Startups Gain Traction",
    snippet: "Robotics industry sees a surge of startups developing cutting-edge tech...",
    category: "Technology",
    date: "January 25, 2025",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/000/608/951/original/vector-breaking-news-background-concept-series-03.jpg"
  },
  {
    id: 10,
    title: "Scientists Discover New Particle",
    snippet: "A mysterious new particle challenges our understanding of physics...",
    category: "Science",
    date: "January 24, 2025",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/000/608/951/original/vector-breaking-news-background-concept-series-03.jpg"
  },
  {
    id: 11,
    title: "Major Investment Hits Renewable Sector",
    snippet: "A record investment is set to boost renewable energy projects globally...",
    category: "Finance",
    date: "January 23, 2025",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/000/608/951/original/vector-breaking-news-background-concept-series-03.jpg"
  }
];

const NewsDetail = ({ news }) => {
  const navigate = useNavigate();
  const id = window.location.pathname.split('/').pop();
  const article = news[id];
  
  // Added state for mobile view related articles
  const [visibleRelated, setVisibleRelated] = useState(4);
  
  if (!article) return <div className="text-center text-red-500">Article not found.</div>;

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
      className="max-w-7xl mx-auto px-4 py-4"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 cursor-pointer group"
      >
        <FiArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to News</span>
      </button>

      {/* Desktop Layout with independent scrolls and vertical divider */}
      <div className="hidden lg:flex gap-8" style={{ height: 'calc(100vh - 120px)' }}>
        <main className="w-2/3 overflow-y-auto pr-4 scrollbar-none">
          {/* Main Article Content */}
          <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            {article.urlToImage && (
              <div className="relative w-full max-h-80 overflow-hidden">
                <img 
                  src={article.urlToImage} 
                  alt={article.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
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
                <div className="ml-auto flex gap-2">
                  <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
                </div>
              </div>
              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
                {article.title}
              </h1>
              {/* Content */}
              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8">
                  {article.description}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  {article.content}
                </p>
              </div>
            </div>
          </article>
        </main>
        {/* Vertical Divider */}
        <div className="w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
        <aside className="w-1/3 pl-4">
          {/* Related Articles Sidebar */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Related Articles</h2>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
            <div className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar pb-6">
              {relatedArticles.map(item => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="flex gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <span className="text-sm text-blue-600 font-medium">
                        {item.category}
                      </span>
                      <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Layout (stacked) */}
      <div className="lg:hidden">
        <main>
          {/* Main Article Content */}
          <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            {article.urlToImage && (
              <div className="relative w-full max-h-80 overflow-hidden">
                <img 
                  src={article.urlToImage} 
                  alt={article.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
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
                <div className="ml-auto flex gap-2">
                  <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
                </div>
              </div>
              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
                {article.title}
              </h1>
              {/* Content */}
              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8">
                  {article.description}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  {article.content}
                </p>
              </div>
            </div>
          </article>
        </main>
        <aside className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Related Articles</h2>
            <div className="space-y-6 mb-6">
              {relatedArticles.slice(0, visibleRelated).map(item => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="flex gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <span className="text-sm text-blue-600 font-medium">
                        {item.category}
                      </span>
                      <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {visibleRelated < relatedArticles.length && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setVisibleRelated(prev => prev + 4)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105 active:scale-95"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default NewsDetail;