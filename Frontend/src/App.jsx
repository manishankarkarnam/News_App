import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NewsFeed from './components/NewsFeed';
import NewsDetail from './components/NewsDetail';
import axios from 'axios';
import BackToTopButton from './components/BackToTopButton';

const App = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [category, setCategory] = useState('news'); // Changed from 'general' to 'news'

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(false);
      try {
        if (category === 'news') {
          // Fetch news from all categories
          const categories = ['technology', 'business', 'finance', 'science'];
          const promises = categories.map(cat => 
            axios.get('https://newsapi.org/v2/top-headlines', {
              params: {
                country: 'us',
                category: cat,
                apiKey: 'ba724484ba4b4742b42abca3c2563b07',
                pageSize: 25 // Reduced to get equal news from each category
              }
            })
          );

          const responses = await Promise.all(promises);
          const allArticles = responses.flatMap(response => response.data.articles);
          setNews(allArticles);
        } else {
          // Existing single category fetch
          const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
              country: 'us',
              category: category,
              apiKey: 'ba724484ba4b4742b42abca3c2563b07',
              pageSize: 100
            }
          });

          if (!response.data.articles) {
            throw new Error('No articles found in response');
          }

          setNews(response.data.articles);
        }
        setError(false);
      } catch (err) {
        console.error('Error fetching news:', err); // Debug log
        setError(true);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  return (
    <Router>
      <div className={`${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} setCategory={setCategory} />
          <div className="container mx-auto px-4 py-2"> {/* Changed from py-8 to py-2 */}
            <Routes>
              <Route path="/" element={<NewsFeed news={news} loading={loading} error={error} />} />
              <Route path="/:categoryName" element={<NewsFeed news={news} loading={loading} error={error} />} />
              <Route path="/news/:id" element={<NewsDetail news={news} />} />
            </Routes>
          </div>
          <BackToTopButton />
        </div>
      </div>
    </Router>
  );
};

export default App;