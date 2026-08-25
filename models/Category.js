const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Category name required'], unique: true, trim: true },
  description: { type: String, trim: true }
});

module.exports = mongoose.model('Category', CategorySchema);