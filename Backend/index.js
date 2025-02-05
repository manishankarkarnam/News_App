const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RSSParser = require('rss-parser');
const cron = require('node-cron');
const Article = require('./models/Article');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/New-App';
const PORT = process.env.PORT || 5000;

// Updated RSS feeds with reliable image sources
const FEEDS = {
  technology: [
    {
      url: 'https://feeds.feedburner.com/TechCrunch/',
      category: 'technology',
      imageExtractor: (item) => {
        if (item['media:content']) {
          return Array.isArray(item['media:content'])
            ? item['media:content'][0].$.url
            : item['media:content'].$.url;
        }
        return null;
      }
    },
    {
      url: 'https://www.wired.com/feed/rss',
      category: 'technology',
      imageExtractor: (item) => {
        const mediaContent = item['media:content'] || item['media:thumbnail'];
        return mediaContent ? mediaContent.$.url : null;
      }
    }
  ],
  business: [
    {
      url: 'https://feeds.feedburner.com/entrepreneur/latest',
      category: 'business',
      imageExtractor: (item) => {
        return item.enclosure ? item.enclosure.url : null;
      }
    },
    {
      url: 'https://www.forbes.com/innovation/feed/',
      category: 'business',
      imageExtractor: (item) => {
        return item['media:content'] ? item['media:content'].$.url : null;
      }
    }
  ],
  finance: [
    {
      url: 'https://www.investing.com/rss/news.rss',
      category: 'finance',
      imageExtractor: (item) => {
        return item['media:content'] ? item['media:content'].$.url : null;
      }
    },
    {
      url: 'https://www.marketwatch.com/rss/topstories',
      category: 'finance',
      imageExtractor: (item) => {
        return item['media:content'] ? item['media:content'].$.url : null;
      }
    }
  ],
  science: [
    {
      url: 'https://www.nature.com/nature.rss',
      category: 'science',
      imageExtractor: (item) => {
        return item['media:content'] ? item['media:content'].$.url : null;
      }
    },
    {
      url: 'https://feeds.feedburner.com/sciencealert-latestnews',
      category: 'science',
      imageExtractor: (item) => {
        if (item['media:content']) {
          return Array.isArray(item['media:content'])
            ? item['media:content'][0].$.url
            : item['media:content'].$.url;
        }
        return null;
      }
    }
  ]
};

const app = express();
app.use(cors());
app.use(express.json());

// Configure parser to accept media content
const parser = new RSSParser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['enclosure', 'enclosure']
    ]
  }
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Enhanced function to fetch and store articles
async function fetchAndStoreNews(feed) {
  try {
    const parsedFeed = await parser.parseURL(feed.url);
    
    for (const item of parsedFeed.items) {
      // Check if article already exists
      const exists = await Article.findOne({ link: item.link });
      if (!exists) {
        // Extract image using feed-specific extractor
        const image = feed.imageExtractor(item);
        
        // Only save articles that have images
        if (image) {
          const newArticle = new Article({
            category: feed.category,
            title: item.title,
            content: item.content || item.contentSnippet || '',
            image: image,
            link: item.link,
            source: parsedFeed.title || 'Unknown',
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date()
          });
          
          await newArticle.save();
          console.log(`Saved article: ${item.title}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching ${feed.category} feed from ${feed.url}:`, error);
  }
}

// Cron job to fetch feeds every 15 minutes
cron.schedule('*/0.5 * * * *', async () => {
  console.log('Cron job started: Fetching news feeds');
  
  // Process each feed independently
  for (const categoryFeeds of Object.values(FEEDS)) {
    for (const feed of categoryFeeds) {
      await fetchAndStoreNews(feed);
    }
  }
  
  // Cleanup old articles
  const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  await Article.deleteMany({ publishedAt: { $lt: cutoff } });
  console.log('Completed: Old articles cleanup');
});

// Enhanced API endpoint with pagination and filtering
app.get('/api/articles', async (req, res) => {
  try {
    const { category, page = 1, limit = 20, source } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (source) filter.source = source;
    
    const articles = await Article.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    const total = await Article.countDocuments(filter);
    
    res.json({
      articles,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});