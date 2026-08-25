const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title required'], trim: true },
  description: { type: String, required: [true, 'Description required'] },
  date: { type: Date, required: [true, 'Date required'] },
  city: { type: String, required: [true, 'City required'] },
  venue: { type: String, required: [true, 'Venue required'] },
  capacity: { type: Number, required: [true, 'Capacity required'], min: 1 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);