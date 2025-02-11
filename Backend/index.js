const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RSSParser = require('rss-parser');
const cron = require('node-cron');
const Article = require('./models/Article');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/New-App';
const PORT = process.env.PORT || 5000;

// Updated RSS feeds with reliable image sources and better content
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
      },
      contentExtractor: (item) => {
        return item['content:encoded'] || 
               item.content || 
               item.description || 
               item.summary || 
               item.contentSnippet || '';
      }
    },
    {
      url: 'https://www.wired.com/feed/rss',
      category: 'technology',
      imageExtractor: (item) => {
        const mediaContent = item['media:content'] || item['media:thumbnail'];
        return mediaContent ? mediaContent.$.url : null;
      },
      contentExtractor: (item) => {
        return item['content:encoded'] || 
               item.content || 
               item.description ||
               item.contentSnippet || '';
      }
    }
  ],
  business: [
    {
      url: 'https://feeds.feedburner.com/entrepreneur/latest',
      category: 'business',
      imageExtractor: (item) => {
        return item.enclosure ? item.enclosure.url : null;
      },
      contentExtractor: (item) => {
        return item['content:encoded'] ||
               item.content ||
               item.description ||
               item.contentSnippet || '';
      }
    },
    {
      url: 'https://www.forbes.com/innovation/feed/',
      category: 'business',
      imageExtractor: (item) => {
        return item['media:content'] ? item['media:content'].$.url : null;
      },
      contentExtractor: (item) => {
        return item['content:encoded'] ||
               item.content ||
               item.description ||
               item.contentSnippet || '';
      }
    }
  ],
  finance: [
    {
      url: 'https://www.investing.com/rss/news.rss',
      category: 'finance',
      imageExtractor: (item) => {
        return item['media:content'] ? item['media:content'].$.url : null;
      },
      contentExtractor: (item) => {
        return item['content:encoded'] ||
               item.content ||
               item.description ||
               item.contentSnippet || '';
      }
    },
    {
      url: 'https://www.marketwatch.com/rss/topstories',
      category: 'finance',
      imageExtractor: (item) => {
        return item['media:content'] ? item['media:content'].$.url : null;
      },
      contentExtractor: (item) => {
        return item['content:encoded'] ||
               item.content ||
               item.description ||
               item.contentSnippet || '';
      }
    }
  ],
  science: [
    {
      url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
      category: 'science',
      imageExtractor: (item) => {
        // BBC feeds typically include media:thumbnail
        if (item['media:thumbnail']) {
          return item['media:thumbnail'].$.url;
        }
        // Fallback to content parsing
        const content = item['content:encoded'] || item.content || '';
        const match = content.match(/<img[^>]+src="([^">]+)"/);
        return match ? match[1] : null;
      },
      contentExtractor: (item) => {
        return item.description ||
               item['content:encoded'] ||
               item.content ||
               item.contentSnippet || '';
      }
    },
    {
      url: 'https://phys.org/rss-feed/physics-news/science-news/',
      category: 'science',
      imageExtractor: (item) => {
        // Phys.org typically includes images in media:content
        if (item['media:content']) {
          return Array.isArray(item['media:content'])
            ? item['media:content'][0].$.url
            : item['media:content'].$.url;
        }
        return null;
      },
      contentExtractor: (item) => {
        return item.description ||
               item['content:encoded'] ||
               item.content ||
               item.contentSnippet || '';
      }
    }
  ]
};

const app = express();
app.use(cors());
app.use(express.json());

// Enhanced parser configuration
const parser = new RSSParser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['content:encoded', 'content:encoded'],
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
        
        // Extract content using feed-specific extractor
        const content = feed.contentExtractor(item);
        
        // Only save articles that have both images and substantial content
        if (image && content && content.length > 100) {
          const newArticle = new Article({
            category: feed.category,
            title: item.title,
            content: content,
            image: image,
            link: item.link,
            source: parsedFeed.title || 'Unknown',
            author: item.creator || item.author || 'Unknown',
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date()
          });
          
          await newArticle.save();
          console.log(`Saved article: ${item.title} from ${feed.url}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching ${feed.category} feed from ${feed.url}:`, error);
  }
}
 
// Cron job to fetch feeds every 30 seconds (*/0.5 * * * *)
cron.schedule('*/0.5 * * * *', async () => {
  console.log('Cron job started: Fetching news feeds');
  
  // Process each feed independently
  for (const categoryFeeds of Object.values(FEEDS)) {
    for (const feed of categoryFeeds) {
      await fetchAndStoreNews(feed);
    }
  }
  
  // Cleanup old articles (delete articles older than 4 days)
  const cutoff = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
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

// Add this endpoint after other API endpoints (or before app.listen)
app.get('/api/news', async (req, res) => {
  try {
    const articles = await Article.find({ category: 'news' }).sort({ publishedAt: -1 });
    res.json({ articles });
  } catch (err) {
    console.error('Error fetching news articles:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add new search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json({ articles: [] });
    }

    const articles = await Article.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).sort({ publishedAt: -1 });

    res.json({ articles });
  } catch (err) {
    console.error('Error searching articles:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});