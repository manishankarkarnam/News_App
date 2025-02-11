import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiClock, FiGlobe } from 'react-icons/fi';
import { ChevronUp, ChevronDown, Share2, Copy } from 'lucide-react';

const NewsDetail = ({ news }) => {
  const navigate = useNavigate();
  const id = window.location.pathname.split('/').pop();
  const article = news.find(item => item._id === id);  // Change to find by _id

  const relatedContainerRef = useRef(null);

  const [similarArticles, setSimilarArticles] = useState([]);
  const [visibleRelated, setVisibleRelated] = useState(4);

  useEffect(() => {
    if (article) {
      const similar = news
        .filter(item => 
          item._id !== id && item.category === article.category
        )
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 10);
      
      setSimilarArticles(similar);
      setVisibleRelated(4);
      
      window.scrollTo(0, 0);
    }
  }, [id, article, news]);

  if (!article)
    return <div className="text-center text-red-500">Article not found.</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const scrollUp = () => {
    if (relatedContainerRef.current) {
      relatedContainerRef.current.scrollBy({ top: -200, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (relatedContainerRef.current) {
      relatedContainerRef.current.scrollBy({ top: 200, behavior: 'smooth' });
    }
  };

  const handleSimilarArticleClick = (articleId) => {
    const element = document.getElementById('article-content');
    if (element) {
      element.style.opacity = 0;
      element.style.transform = 'translateY(-20px)';
    }
    
    setTimeout(() => {
      navigate(`/news/${articleId}`);
      window.scrollTo(0, 0);
    }, 200);
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-7xl mx-auto px-4 py-4"
      >
        <div className="hidden lg:flex gap-8" style={{ height: 'calc(100vh - 120px)' }}>
          <main className="w-2/3 overflow-y-auto pr-4 scrollbar-none">
            <motion.article 
              id="article-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl"
            >
              {article.image && (
                <div className="relative w-full h-64">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-auto h-full mx-auto object-contain"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
              <div className="p-8">
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
                    <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  {article.title}
                </h1>
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8">
                    {article.content}
                  </p>
                </div>
              </div>
            </motion.article>
          </main>
          <div className="w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
          <aside className="w-1/3 pl-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Related Articles</h2>
                <div className="flex gap-2">
                  <button onClick={scrollUp} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button onClick={scrollDown} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              <div ref={relatedContainerRef} className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar pb-6">
                {similarArticles.map((item) => (
                  <div 
                    key={item._id}
                    onClick={() => handleSimilarArticleClick(item._id)}
                    className="relative block transform scale-95 transition duration-300 hover:scale-100 hover:z-50 cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <span className="text-sm text-blue-600 font-medium">
                          {item.category}
                        </span>
                        <h3 className="font-medium">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="lg:hidden">
          <motion.main
            id="article-content-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
              {article.image && (
                <div className="relative w-full h-64">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-auto h-full mx-auto object-contain"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
              <div className="p-8">
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
                    <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  {article.title}
                </h1>
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8">
                    {article.content}
                  </p>
                </div>
              </div>
            </article>
          </motion.main>
          <aside className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Related Articles</h2>
              <div ref={relatedContainerRef} className="space-y-6 mb-6 max-h-96 overflow-y-auto custom-scrollbar">
                {similarArticles.slice(0, visibleRelated).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSimilarArticleClick(item._id)}
                    className="relative block transform scale-95 transition duration-300 hover:scale-100 hover:z-50 cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <span className="text-sm text-blue-600 font-medium">
                          {item.category}
                        </span>
                        <h3 className="font-medium">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {visibleRelated < similarArticles.length && (
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
    </AnimatePresence>
  );
};

export default NewsDetail;