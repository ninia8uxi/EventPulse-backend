const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: [true, 'Message text required'] }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);