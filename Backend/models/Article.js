const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  content: String,
  image: String,
  link: { type: String, unique: true },
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now, index: true }
}, { collection: 'news-data' }); // specify collection name

module.exports = mongoose.model('Article', ArticleSchema);
