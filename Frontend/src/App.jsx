import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NewsFeed from './components/NewsFeed';
import NewsDetail from './components/NewsDetail';
import axios from 'axios';
import BackToTopButton from './components/BackToTopButton';
import SearchResults from './components/SearchResults';

const App = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [category, setCategory] = useState('news'); // default category

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(false);
      try {
        // When in news section, load all feeds (using a high limit) from all categories
        const limitParam = category === 'news' ? '?limit=1000' : `?category=${category}`;
        const url = `http://localhost:5000/api/articles${limitParam}`;
        const response = await axios.get(url);
        setNews(response.data.articles);
      } catch (err) {
        console.error('Error fetching news:', err);
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
          <div className="container mx-auto px-4 py-2">
            <Routes>
              <Route path="/" element={<NewsFeed news={news} loading={loading} error={error} />} />
              <Route path="/:categoryName" element={<NewsFeed news={news} loading={loading} error={error} />} />
              <Route path="/news/:id" element={<NewsDetail news={news} />} />
              <Route path="/search" element={<SearchResults />} /> {/* Remove the articles prop */}
            </Routes>
          </div>
          <BackToTopButton />
        </div>
      </div>
    </Router>
  );
};

export default App;