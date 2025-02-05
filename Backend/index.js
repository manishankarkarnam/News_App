const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RSSParser = require('rss-parser');
const cron = require('node-cron');
const Article = require('./models/Article');

// Configuration updated to use the "New-App" database
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/New-App';
const PORT = process.env.PORT || 5000;

// Mapping: RSS feed URLs per category (updated with multiple sources)
const FEEDS = {
  technology: [
    { url: 'https://techcrunch.com/feed/', category: 'technology' },
    { url: 'https://www.theverge.com/rss/index.xml', category: 'technology' }
  ],
  business: [
    { url: 'https://www.bloomberg.com/feed/podcast/bloomberg-business', category: 'business' },
    { url: 'https://hbr.org/feed', category: 'business' }
  ],
  finance: [
    { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', category: 'finance' },
    { url: 'https://www.investopedia.com/feedbuilder/feed/getfeed/?feedName=rss_headline', category: 'finance' }
  ],
  science: [
    { url: 'https://www.sciencedaily.com/rss/all.xml', category: 'science' },
    { url: 'https://www.newscientist.com/feed/home?cmpid=RSS%7CNSNS-Home', category: 'science' }
  ]
};

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const parser = new RSSParser();

// Utility: Fetch and store articles from a given RSS feed
async function fetchAndStoreNews(feedUrl, category) {
  try {
    const feed = await parser.parseURL(feedUrl);
    for (const item of feed.items) {
      // Check if article exists using a unique link
      const exists = await Article.findOne({ link: item.link });
      if (!exists) {
        // Extract image URL from various possible fields
        const image =
          item.enclosure?.url ||
          (item['media:content'] && item['media:content'].url) ||
          (item['media:thumbnail'] && item['media:thumbnail'].$.url) ||
          null;

        const newArticle = new Article({
          category,
          title: item.title,
          content: item.content || item.contentSnippet || '',
          image,
          link: item.link,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date()
        });
        await newArticle.save();
      }
    }
  } catch (error) {
    console.error(`Error fetching ${category} feed:`, error);
  }
}

// Cron job: Every 3 minutes, fetch RSS feeds and delete articles older than two days.
cron.schedule('*/15 * * * *', async () => {
  console.log('Cron job started');

  // Iterate over all categories and their respective feeds
  for (const [category, feeds] of Object.entries(FEEDS)) {
    for (const feed of feeds) {
      await fetchAndStoreNews(feed.url, feed.category);
    }
  }

  // Cleanup: delete articles older than 2 days
  const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  await Article.deleteMany({ createdAt: { $lt: cutoff } });
  console.log('Old articles cleanup complete');
});

// API endpoint: Get articles with optional category filtering
app.get('/api/articles', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const articles = await Article.find(filter).sort({ publishedAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});