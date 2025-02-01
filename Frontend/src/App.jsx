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
  const [category, setCategory] = useState('general');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines`,
          {
            params: {
              country: 'us',
              category: category,
              apiKey: '75b545ed102a49328383a59b3f963e51',
              pageSize: 100 // Get more articles per request
            }
          }
        );
        setNews(response.data.articles);
      } catch (err) {
        setError(true);
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
          {/* Navbar */}
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} setCategory={setCategory} />
          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
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